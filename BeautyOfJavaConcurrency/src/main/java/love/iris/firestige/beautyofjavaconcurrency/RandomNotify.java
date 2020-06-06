package love.iris.firestige.beautyofjavaconcurrency;

import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Slf4j
public class RandomNotify {

        private static volatile Object resourceA = new Object();

        public static void main(String[] args) throws InterruptedException {
            ExecutorService pool = Executors.newCachedThreadPool();
            int concurrencyThreadNum = 10;
            CountDownLatch latch = new CountDownLatch(concurrencyThreadNum);
            for (int i = 0; i < 10;) {
                pool.execute(new Task(++i, resourceA, latch));
            }
            Thread.sleep(TimeUnit.SECONDS.toMillis(1));
            synchronized (resourceA) {
                resourceA.notify();
                log.info("release lock");
            }
            latch.await();
            log.info("done!");
        }

        public static class Task implements Runnable {

            private final int i;
            private final Object lock;
            private final CountDownLatch latch;

            public Task(int i, Object lock, CountDownLatch latch) {
                this.i = i;
                this.lock = lock;
                this.latch = latch;
            }

            @Override
            public void run() {
                synchronized (lock) {
                    log.info(String.format("thread-%d get lock", i));
                    try {
                        log.info(String.format("thread-%d begin wait", i));
                        lock.wait();
                        log.info(String.format("thread-%d end wait", i));
                        Thread.sleep(TimeUnit.SECONDS.toMillis(2));
                        lock.notify();
                    } catch (InterruptedException e) {
                        log.error(e.getMessage());
                    }
                    log.info(String.format("thread-%d release lock", i));
                    latch.countDown();
                }
            }
        }
}
