export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <main>
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div>
        <form action="" method="get">
          <button type="submit">Try again</button>
        </form>
        <a href="${import.meta.env.BASE_URL}">Go home</a>
      </div>
    </main>
  </body>
</html>`;
}
