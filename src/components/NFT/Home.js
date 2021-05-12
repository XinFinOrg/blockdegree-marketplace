import React, { useEffect, useState } from "react";
// import { faUser, faProjectDiagram } from "@fortawesome/free-solid-svg-icons";

import { AnimatedNumberCard } from "../common/NumberCard";
import { Container, Row, Col } from "react-bootstrap";
import { DEFAULT_COLLECTIONS } from "../../helpers/constant";
import { SubmitContractTxGeneral } from "../../wallets";

const Home = () => {
  const [totalNFT, settotalNFT] = useState(0);
  const [totalAuction, settotalAuction] = useState(0);
  const [totalAuctionActive, settotalAuctionActive] = useState(0);

  useEffect(() => {
    Promise.all(
      DEFAULT_COLLECTIONS.map(({ address }) =>
        SubmitContractTxGeneral("totalSupply", { type: "nft", address }, "view")
      )
    )
      .then((resp) =>
        resp.reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0)
      )
      .then((resp) => settotalNFT(resp))
      .catch(console.error);

    SubmitContractTxGeneral("getTotalAuctions", { type: "auction" }, "view")
      .then((resp) => {
        const allproms = [];
        for (let i = 0; i < resp; i++) {
          allproms.push(
            SubmitContractTxGeneral("auctions", { type: "auction" }, "view", i)
          );
        }
        return Promise.all(allproms);
      })
      .then((allAddr) => {
        const total = allAddr.length;
        allAddr = allAddr.filter(
          ({ startTime, duration }) =>
            parseFloat(Math.ceil(Date.now() / 1000)) >= parseFloat(startTime) &&
            parseFloat(Math.ceil(Date.now() / 1000)) <=
              parseFloat(startTime) + parseFloat(duration)
        );
        settotalAuction(total);
        settotalAuctionActive(allAddr.length);
      });
  });

  return (
    <div className="component-panel u-text-center">
      <p>WELCOME TO BLOCKDEGREE NFT MARKETPLACE </p>
      <p>
        {" "}
        ( In <b>ALPHA</b> stage ){" "}
      </p>
      <p>
        <Container className="stats">
          <Row>
            <Col>
              <AnimatedNumberCard
                title={"Total Auctions"}
                color={"red"}
                number={totalAuction}
              />
            </Col>
            <Col>
              <AnimatedNumberCard
                title={"Active Auctions"}
                color={"blue"}
                number={totalAuctionActive}
              />
            </Col>
            <Col>
              <AnimatedNumberCard
                title={"Total NFTs Minted"}
                color={"green"}
                number={totalNFT}
              />
            </Col>
          </Row>
        </Container>
      </p>
    </div>
  );
};

export default Home;
