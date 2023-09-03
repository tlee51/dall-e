import express from 'express'
import * as dotenv from 'dotenv'
// import { Configuration, OpenAIApi } from 'openai'                  //video uses old version
import OpenAI from 'openai';                                           //this is the new version

dotenv.config()

const router = express.Router() 

// const configuration = new Configuration({                          //this is the old implementation
//     apiKey: process.env.OPENAI_API_KEY,
// })

// const openai = new OpenAIApi(configuration)

const openai = new OpenAI({                                           //lines 16-18 are the new implementation
    apiKey: process.env.OPENAI_API_KEY,
});

router.route('/').get((req, res) => {
    res.send('Hello from DALL-E!')
})

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body

    // const aiResponse = await openai.createImage({
    //   prompt,
    //   n: 1,
    //   size: '1024x1024',
    //   response_format: 'b64_json',
    // });

    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });

  //   const image = aiResponse.data.data[0].b64_json;

  //   res.status(200).json({ photo: image });
  // } catch (error) {
  //     console.log(error);
  //     res.status(500).send(error?.response.data.error.message)
  // }

// } catch (error) {
//   console.error(error);
//   if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
//     res.status(500).send(error.response.data.error.message);
//   } else {
//     res.status(500).send("An error occurred while processing your request.");
//   }
// }

// Check if aiResponse and its data array are defined
if (aiResponse && aiResponse.data && aiResponse.data.length > 0) {
  const image = aiResponse.data[0].b64_json;
  res.status(200).json({ photo: image });
} else {
  // Handle the case where aiResponse or its data array is undefined
  res.status(500).send("No valid response data from the API.");
}
} catch (error) {
console.error(error);

// Check if error.response and its data object are defined
if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
  res.status(500).send(error.response.data.error.message);
} else {
  res.status(500).send("An error occurred while processing your request.");
}
}
});

// })

export default router;