package love.iris.firestige.cf.blog;

import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * @author firestige
 */
@Slf4j
public class Example1 {

    public static CountDownLatch latch = new CountDownLatch(6);

    public static void main(String[] args) throws InterruptedException {
        /*
        ExecutorService pool = Executors.newFixedThreadPool(3);
        for (int i = 0; i < 6; i++) {
            pool.execute(new Task());
        }
        latch.await();
        pool.shutdown();
        System.exit(0);
         */
        long l1 = (long) ((1L << 31) * (Math.sqrt(5) - 1));
        System.out.println("as 32 bit unsigned: " + l1);
        int i1 = (int) l1;
        System.out.println("as 32 bit signed:   " + i1);
        System.out.println("MAGIC = " + 0x61c88647);
    }

    public static class Task implements Runnable {

        private static final List<String> list = new ArrayList<>();
        ThreadLocal<List<String>> listThreadLocal = ThreadLocal.withInitial(() -> new ArrayList<>(list));

        @Override
        public void run() {
            listThreadLocal.get().add(Thread.currentThread().getName());
            log.info(listThreadLocal.get().toString());
            latch.countDown();
        }
    }
}
