### Eris-Typings
> Unofficial typings for [abalabahaha's](https://github.com/abalabahaha) [eris](https://github.com/abalabahaha/eris).<br/>
> Keep in mind these typings are handwritten, and very experimental. End goal is to merge with eris' repository.

### Usage
You can install this library via `typings` CLI tool, or manually. Keep in mind some requirements:
* Your project has to target ES6 or above
* You must have `@types/node` installed alongside

#### Example
* `npm i -g typescript typings`
* `mkdir eris-typescript-example && cd eris-typescript-example`
* `typings init`
* `npm init`
* `tsc --init`
* `npm i -S eris && npm --save-dev @types/node`
* `typings install eris=github:aurieh/eris-typings --save --global`
* Change `target` in `compilerOptions` of `tsconfig.json` to `es6` or above
* Make a file called `bot.ts`

```typescript
// bot.ts
// most of type annotations are not needed in an actual project, this is just an example
import { Client, Message } from 'eris';

const client: Client = new Client('YOUR TOKEN HERE');

client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return;
  if (message.content.startsWith('ping')) {
    try {
      message.channel.createMessage('pong');
    } catch (e) {
      console.error(e);
    }
  }
});

client.on('ready', () => {
  console.log(`Ready as ${client.user.username}#${client.user.discriminator}`);
});

client.connect();
```

### Contributing
1. Clone the repo
2. Implement your changes
3. Make sure everything compiles (no linting has been set up yet)
4. Create a pull request
