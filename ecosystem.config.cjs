module.exports = {
  apps : [{  name: "back",
    script: "yarn start",
    env: {
      OPENAI_API_KEY: "yourkey"
    },
},{  name: "front",
    script: "cd ../-your-image-react-metamask && yarn dev",
    env: {
    },
}],
};
