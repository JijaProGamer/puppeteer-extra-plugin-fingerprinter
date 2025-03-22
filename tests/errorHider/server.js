import * as path from "path"
import express from "express"

const app = express();


// Define a route for the homepage
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Express Server</title>
    </head>
    <body>
      <h1>Welcome to Express Server!</h1>
      <p>This is a simple example of an Express server sending HTML with JavaScript.</p>
      <script>
      function myBotCheck() {
        let err = new Error('test err');
        console.log('err.stack: ', err.stack);
        console.log(err.stack.split("\\n"))
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
      </script>
    </body>
    </html>
  `;

  res.send(html);
});

// Start the server
const PORT = 3050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
