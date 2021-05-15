# NFT Marketplace

NFT Marketplace is an open-source DAPP built on XinFin's XDPoS protocol based blockchain. Here students who are certified on [Blockdegree](https://www.blockdegree.org/) can choose to put their certificate's NFT for trade.  


| [![XDC](https://www.blockdegree.org/img/partners/xdc_logo.png)](https://xinfin.org/)  | [![Blockdegree](https://www.blockdegree.org/img/brand/blockdegree_dark.png?v=2)](https://www.blockdegree.org) |
|:---:|:---:|
| https://xinfin.org |https://www.blockdegree.org |  
  
  
Students can put up their NFT's for sale there by mentioning a seed price and duration of the auction.
Auction bids take place in XDC only for now but its planned to add support for other XRC20 tokens & stablecoins.  

Apart from the default listed NFT ( Blockdegree ) users can choose to trade any NFT which supports the following standard interfaces ( interface ids mentioned as well ):

 - ERC165 - `0x01ffc9a7`
 - ERC721 - `0x80ac58cd`
 - ERC721Metadata - `0x5b5e139f`
 - ERC721Enumerable - `0x780e9d63`

## Setup

The contracts have been deployed on XDC mainnet at the following addresses:

- Blockdegree NFT - [xdcb1b4218ad6a2df75bf07cfddf7732915911dd1b4](https://explorer.xinfin.network/addr/xdcb1b4218ad6a2df75bf07cfddf7732915911dd1b4)  
- AuctionEngine - [xdca1de6525e281a4455009699c6c3977243976f3a6](https://explorer.xinfin.network/addr/xdca1de6525e281a4455009699c6c3977243976f3a6)  


If trying on local chain or apothem testnet, you can change the addresess mentioned in this [file](./src/helpers/constant.js).

### Commands to start UI

```
npm i
npm start
```

## Helpful Links

Links to youtube videos, articles.

 - [Integrated NFT Marketplace on BlockDegree](https://www.youtube.com/watch?v=WOWIjxt8Zyw)
 - [Medium Aritcle](https://medium.com/blockdegree/nfts-blockdegree-shapes-the-future-of-educational-degree-af061c303ff0)

## Contribution

Anyone is welcomed to contribute to this project.  
Please create an issue / pull request with proposed bug-fix or feature addition along with a brief on your work.  
You can also check dev task to be done from [here](./DevReadme.md)

You can also check out our dev channels to get in touch.

Discord: https://discord.gg/uuSYtEZNTp  
Reddit: https://www.reddit.com/r/xinfin/  
Telegram: https://t.me/xinfin  
Slack: https://launchpass.com/xinfin-public  

