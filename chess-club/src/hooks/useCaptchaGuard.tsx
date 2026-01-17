export function useCaptchaGuard() {
    const Captcha = <div />;

    const runWithCaptcha = async (action: () => Promise<void> | void) => {
        console.log("Captcha bypassed");
        await action();
    };

    return { Captcha, runWithCaptcha };
}