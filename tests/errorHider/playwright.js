import { GetCommonFingerprint, GenerateFingerprint, LaunchBrowser, ConnectFingerprinter } from "../../index.js";

function requestInterceptor(page, requestData, route) {
    return "proxy"
};

let proxy = "direct://";

(async () => {
    let fingerprint = {
        ...GenerateFingerprint("firefox"),
        proxy
    }

    const context = (await LaunchBrowser("firefox", {
        headless: false,
        serviceWorkers: "block"
    }, fingerprint)).browser

    /*const context = await browser.newContext({
        resources: 'low',
        serviceWorkers: "block"
    });*/

    context.setDefaultNavigationTimeout(0)

    //await ConnectBrowserFingerprinter(browser.browserType(), context)

    const page = (await context.pages())[0];
    await page.bringToFront();

    console.log(fingerprint)

    await ConnectFingerprinter("firefox", page, {
        fingerprint,
        requestInterceptor
    }, [])

    page.on("console", (message) => {
        if(message.text().includes("Warning"))
            return

        console.log(`${message.type()}: ${message.text()}`)
    })

    /*await page.goto('https://browserleaks.com/webgl');

    setTimeout(() => {
        page.evaluate(() => {
            function myBotCheck() {
                let err = new Error('test err');
                console.log('err.stack: ', err.stack);
                if (err.stack.toString().includes('puppeteer')) {
                    document.getElementById('yesOrNo').innerHTML = 'Yes';
                }
            }
            
            function overrideFunction(item) {
                item.obj[item.propName] = (function (orig) {
                    return function () {
            
                        myBotCheck();
            
                        let args = arguments;
                        let value = orig.apply(this, args);
            
                        return value;
                    };
            
                }(item.obj[item.propName]));
            }
            
            overrideFunction({
                propName: 'querySelector',
                obj: document
            });

            document.querySelector("p")
        }).catch(() => {})
    }, 10000)*/
    //await page.goto('https://www.youtube.com/watch?v=R83W2XR3IC8')

    await page.goto("http://localhost:3050")

    page.evaluate(() => {
        function toToString(){
            return 'function toString() { [native code] }'
        }

        function toNameString(){
            return "Error"
        }

        function toString(){
            return 'function Error() { [native code] }'
        }

        toToString.prototype.toString = toToString;
        toString.prototype.toString = toToString;
        toNameString.prototype.toString = toToString;

        class ModifiedError extends Error {
            constructor(message) {
                super(message)
  
                let stack = this.stack.split("\n")

                /*stack[0] = stack[0]
                    .replace("ModifiedError", "Error")
                    .replace(/debugger eval code line %s > eval/g, "");
                
                stack.pop()
                //stack = stack.slice(0, stack.length - 9)
                
                stack.splice(2, 1)*/

                stack.pop()
                stack.shift()

                while(stack.length > 1){
                    let string = stack[stack.length - 1]
                    let blacklist = ["debugger", "chrome", "SimpleChannel", "juggler"]
                    
                    if(blacklist.some((v) => string.includes(v))){
                        stack.pop()
                    } else {
                        break
                    }
                }

                let uri = new URL(document.URL)

                let randomLine = Math.floor(Math.random() * 200)
                let randomLineSlot = Math.floor(Math.random() * 50)
                stack.push(`@${uri.origin}${uri.pathname}:${randomLine}:${randomLineSlot}`)
                stack.push("\n")

                this.stack = stack.join("\n")
            }
        }

        ModifiedError.toString = toToString
        ModifiedError.prototype.toString = toNameString;
        ModifiedError.prototype.name = "Error"

        Object.defineProperty(window, 'Error', { configurable: false, writable: false, value: ModifiedError })
    })

    setTimeout(() => {
        page.evaluate(() => {
            document.querySelector("p")
        }).catch(() => {})
    }, 10000)
})();