package com.github.firestige.watcher.impl;

import com.github.firestige.watcher.PathEvent;
import com.github.firestige.watcher.PathEventHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.nio.file.Path;

/**
 * @author gugumian
 */
@Slf4j
@Component
public class ClusterConfigModifiedHandler implements PathEventHandler {

    @Override
    public Path getTarget() {
        return Path.of("D:\\Users\\ZZTNB\\Downloads\\Documents\\clusterConfig.properties");
    }

    @Override
    public void handle(PathEvent event) {
        log.info("file: {} Modified, trigger handler", event.getTarget().toAbsolutePath());
    }
}
