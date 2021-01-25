package com.github.firestige.watcher;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * @author gugumian
 */
@Slf4j
@Component
public class PathEventDispatcher implements ApplicationContextAware {

    private volatile boolean running;
    private WatchService service;
    private final Map<Path, PathEventHandler> handlerMap = new HashMap<>();

    @PostConstruct
    private void init() throws IOException {
        service = FileSystems.getDefault().newWatchService();
        running = false;
        for (Path path: handlerMap.keySet()) {
            path.getParent().register(service, StandardWatchEventKinds.ENTRY_MODIFY);
        }
    }

    public boolean isRunning() {
        return running;
    }

    public void start() {
        if (!running) {
            running = true;
            dispatch();
        }
    }

    public void stop() {
        if (running) {
            running = false;
        }
    }

    @Async("daemonPool")
    public void dispatch() {
        createEventStream().limitRate(1).subscribe(event -> handlerMap.getOrDefault(event.getTarget(), new PathEventHandler() {
            @Override
            public Path getTarget() {
                return null;
            }

            @Override
            public void handle(PathEvent event) {
                log.info("target: null, event: {}", event.getTarget());
            }
        }).handle(event));
    }

    private Flux<PathEvent> createEventStream() {
        return Flux.create(fluxSink -> {
            while (running) {
                try {
                    WatchKey watchKey = service.poll(10, TimeUnit.SECONDS);
                    if (watchKey!=null) {
                        Path watched = (Path) watchKey.watchable();
                        for (WatchEvent<?> event: watchKey.pollEvents()) {
                            fluxSink.next(new PathEvent(watched.resolve((Path) event.context()), event.kind()));
                        }
                        watchKey.reset();
                    }
                } catch (InterruptedException e) {
                    running = false;
                    fluxSink.error(e);
                }
            }
            fluxSink.complete();
        });
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        applicationContext.getBeansOfType(PathEventHandler.class).values().forEach(handler -> handlerMap.put(handler.getTarget(), handler));
    }
}
