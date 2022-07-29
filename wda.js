const loadingPage = `
<title>${encodeURIComponent('')}APP</title>
<style>html{background:${encodeURIComponent('#000000')};}</style>
<script>paramsForReuse = ${JSON.stringify(undefined)}
console.log(window.)
;</script>`;


const html5 = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${encodeURIComponent('')}APP</title>
    <style>
      html {
        background:${encodeURIComponent('#000000')};
        color: aliceblue;
      }
    </style>
</head>
<body>
    <h1>Loading...</h1>    
</body>
</html>`
//--window-position=0,0 --window-size=1,1
const appMode = { 
    headless: false,
    //ignoreHTTPSErrors: true,
    defaultViewport: null, // Fix window-size
    // userDataDir: './myUserDataDir',
    //width: 800,
    //top: 20,
    ignoreDefaultArgs: [
      '--enable-automation', // No Automation futures
      '--enable-blink-features=IdleDetection' // Disable experimental default flag
    ],
    args: [
      '--enable-features=NetworkService',
      `--app=data:text/html,${html5}`, // Load the App
      '--no-default-browser-check', // Suppress browser check
      //'--window-size=800,800',
      '--start-maximized',
    ]
};

const disableGoogleKeysMissingMessage = () => {
    process.env.GOOGLE_API_KEY = "no";
    process.env.GOOGLE_DEFAULT_CLIENT_ID="no";
    process.env.GOOGLE_DEFAULT_CLIENT_SECRET="no";
}

disableGoogleKeysMissingMessage();

(async () => {
  const browser = await puppeteer.launch(appMode);
  const openPages = await browser.pages();
  openPages.forEach(async (page, i) => {
    if (i === 0) {
      const preloadScript = () => {
        const observer = new MutationObserver(() => {
          const resetBtn = document.querySelector(
            '#fullscreen-wrapper > div.content > div > div:nth-child(2) > div > now-player-box > div > now-player > now-continue-board > div > button.no-break.btn-spacing.button-default.secondary.btnReset.ng-star-inserted'
          );
          if (resetBtn) {
               console.log("It's in the DOM!");
               resetBtn.click();
           }
        });
        
        // Registering a Observer that intercepts the "fortsetzen" "restart" and clicks restart
        observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
      }
      
      await page.evaluateOnNewDocument(preloadScript);
      await page.goto('https://www.tvnow.de/');
      // Read localstorage last viewed goto last viewed or offer interface.
    } else {
      page.close(); // Close eventual existing popups 
    }
  });
})();
