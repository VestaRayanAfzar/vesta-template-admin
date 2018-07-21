export class SplashPlugin {

    public static show() {
        document.body.classList.add("has-splash");
    }

    public static hide() {
        document.body.classList.remove("has-splash");
    }
}
