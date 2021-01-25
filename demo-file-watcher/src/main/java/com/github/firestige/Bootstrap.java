package com.github.firestige;

import com.github.firestige.watcher.PathEventDispatcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

import javax.annotation.PostConstruct;

/**
 * @author gugumian
 */
@EnableAsync
@SpringBootApplication
public class Bootstrap {

    @Autowired
    PathEventDispatcher dispatcher;

    public static void main(String[] args) {
        SpringApplication.run(Bootstrap.class, args);
    }

    @PostConstruct
    public void init() {
        dispatcher.start();
    }
}
