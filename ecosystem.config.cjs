module.exports = {
  apps : [{  name: "back",
    script: "yarn start",
    env: {
      OPENAI_API_KEY: "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"
    },
},{  name: "front",
    script: "cd ../-your-image-react-metamask && yarn dev",
    env: {
    },
}],
};
