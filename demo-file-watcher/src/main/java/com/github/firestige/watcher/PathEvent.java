package com.github.firestige.watcher;

import java.nio.file.Path;
import java.nio.file.WatchEvent;

/**
 * @author gugumian
 */
public class PathEvent {
    private final Path target;
    private final WatchEvent.Kind<?> type;

    public PathEvent(Path target, WatchEvent.Kind<?> type) {
        this.target = target;
        this.type = type;
    }

    public Path getTarget() {
        return target;
    }

    public WatchEvent.Kind<?> getType() {
        return type;
    }
}
