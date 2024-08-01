import { WechatyBuilder, Message, log, types } from 'wechaty';
import { FileBox } from 'file-box';
import { WeChatSdkPuppetBridge_3_9_10_19 as PuppetBridge } from '@src/mod';
import { jsonStringify } from '@src/shared/tools';

async function main() {
  const puppet = new PuppetBridge({
    apiUrl: 'http://127.0.0.1:8888',
    protocol: 'ws'
  });

  const bot = WechatyBuilder.build({ name: 'wechatsdk-bot', puppet });

  bot.on('login', user => {
    log.info('Bot use login: ', jsonStringify(user));
  });

  bot.on('ready', () => {
    log.info('Bot is ready');
  });

  bot.on('message', onMessage);

  bot.on('logout', user => {
    log.info('Bot user logout: ', jsonStringify(user));
  });

  bot.on('error', error => {
    log.error('Bot error:', error.message);
  });

  await bot.start();
}

main()
  .then(() => log.info('StarterBot', 'Ready'))
  .catch(console.error);

// ------------------------------

async function onMessage(msg: Message) {
  log.info('Bot Msg: ', jsonStringify(msg));

  const contact = msg.talker();
  log.info('Bot Msg Contact: ', jsonStringify(contact));

  log.info('Bot Msg Type: ', msg.type());

  switch (msg.type()) {
    case types.Message.Image:
      log.info('image', msg.text());

      const messageImage = msg.toImage();

      const thumbImage = await messageImage.thumbnail();
      const thumbImageData = await thumbImage.toBuffer();

      log.info(`thumb image size: ${thumbImageData.length}`);
      log.info(`thumn image name: ${thumbImage.name}`);

      break;
    case types.Message.Attachment:
    case types.Message.Video:
    case types.Message.Audio:
    case types.Message.Emoticon:
      const file = await msg.toFileBox();

      log.info('file name: ', file.name);
      log.info('file size: ', file.size);
      log.info('file type: ', file.type);

      const fileData = await file.toBuffer();
      log.info(`file data size: ${fileData.length}`);
      break;
    default:
      console.log('not support');
      break;
  }
}
