package love.iris.firestige.beautyofjavaconcurrency;

/**
 * @author gugumian
 */
public class SynchronizedDemo {

    public synchronized static void staticMethod() {
        System.out.println("static synchronized method");
    }
    //同步方法
    public synchronized void method() {
        System.out.println("synchronized method");
    }
    //同步代码块
    public void inner() {
        synchronized (this) {
            System.out.println("inner synchronized method");
        }
    }
}
