package com.github.firestige.watcher;

import java.nio.file.FileVisitResult;
import java.nio.file.Path;

public interface PathEventHandler {
    Path getTarget();
    void handle(PathEvent event);
}
