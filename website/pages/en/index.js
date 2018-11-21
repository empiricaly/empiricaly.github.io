/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function imgUrl(img) {
  return `${siteConfig.baseUrl}img/${img}`;
}

function docUrl(doc, language) {
  return `${siteConfig.baseUrl}docs/${language ? `${language}/` : ""}${doc}`;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? `${language}/` : "") + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: "_self"
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} alt="Project Logo" />
  </div>
);

const ProjectTitle = () => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    const language = this.props.language || "";
    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl("quick-start.html", language)}>
              Getting Started
            </Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    padding={["bottom", "top"]}
    id={props.id}
    background={props.background}
  >
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Intro = () => (
  <Block background="light">
    {[
      {
        content:
          "Empirica is an open-source JavaScript framework for running multiplayer interactive experiments and games in the browser. It was created to make it easy to develop and iterate on sophisticated designs in a statistically sound manner, and offers a unique combination of power, flexibility, and speed.",
        image: imgUrl("screenshot1.png"),
        title: "" // Title is required because GridBlock is stupid
      }
    ]}
  </Block>
);

const FeaturesA = () => (
  <Block layout="threeColumn">
    {[
      {
        content:
          "Empirica will handle all the tedious logistics: from crossing your independent variables to form treatments, randomization, synchronization, data collection, and managing players. You get straight to what is unique about your research and what interests you, whatever that may be.",
        image: imgUrl("wrench.svg"),
        imageAlign: "top",
        title: "Be Productive"
      },
      {
        content:
          "Study more complex tasks and set up interactions that happen over any period of time, from seconds to months, or among any number of people, from a single player to groups of any size. Don’t be constrained by the limitations of standard behavioral experiments.",
        image: imgUrl("calendar-alt.svg"),
        imageAlign: "top",
        title: "Be Expansive & Realistic"
      },
      {
        content:
          "It is easy to implement simple A/B tests with independent players in Empirica. But it's just as easy to implement group experiments with real-time or asynchronous interactions in a factorial or within-subjects design, or designs involving multiple types of units and conditional logic.",
        image: imgUrl("circle.svg"),
        imageAlign: "top",
        title: "Simple or Complex"
      }
    ]}
  </Block>
);

const FeaturesB = () => (
  <Block layout="threeColumn">
    {[
      {
        content:
          "Empirica provides you with easily configurable artificial players that can be included in the experimental game. This allows for studying Human + AI social systems. This hybrid system could be the future of our society!",
        image: imgUrl("code.svg"),
        imageAlign: "top",
        title: "Real or Artificial"
      },
      {
        content:
          "Empirica is based on widely-used web technology standards: Javascript and React.js. This means you can create your own experimental games with only little prior programming knowledge.",
        image: imgUrl("js.svg"),
        imageAlign: "top",
        title: "Flexible Standards"
      },
      {
        content:
          "Deploy your experiment from a web interface and watch the progress in real time with the ability to create one-way mirrors to observe the behavior of players in your virtual lab.",
        image: imgUrl("chart-line.svg"),
        imageAlign: "top",
        title: "Don’t miss the action"
      }
    ]}
  </Block>
);

const FeatureCallout = () => (
  <div
    className="productShowcaseSection paddingBottom"
    style={{ textAlign: "center" }}
  >
    <h2>Feature Callout</h2>
    <MarkdownBlock>These are features of this project</MarkdownBlock>
  </div>
);

const Team = () => (
  <Block background="light">
    {[
      {
        content:
          "Empirica is developed by [Abdullah Almaatouq](http://www.amaatouq.com/) ([LinkedIn](https://www.linkedin.com/in/amaatouq/), [Twitter](https://twitter.com/amaatouq/)) and [Nicolas Paton](https://www.linkedin.com/in/nicolaspaton/)",
        title: "Team"
      }
    ]}
  </Block>
);

const Support = () => (
  <Block id="try">
    {[
      {
        content:
          "We are also advised and supported by a strong team of academics and science enthusiasts including [Iyad Rahwan](https://rahwan.me/), [Duncan Watts](https://www.microsoft.com/en-us/research/people/duncan/), [Alex ‘Sandy’ Pentland](https://www.media.mit.edu/people/sandy/overview/), [Joshua Becker](https://www.joshua-becker.com/), [Alejandro Campero](https://www.linkedin.com/in/alejandro-noriega-campero-40305637/), [Niccolo Pescetelli](https://niccolopescetelli.com/about/), and [Joost P Bonsen](https://d-lab.mit.edu/staff/joost_bonsen).",
        title: "Support"
      }
    ]}
  </Block>
);

class Index extends React.Component {
  render() {
    const language = this.props.language || "";

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Intro />
          <FeaturesA />
          <FeaturesB />
          <Team />
          <Support />
        </div>
      </div>
    );
  }
}

module.exports = Index;
