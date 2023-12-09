const generateForm = document.querySelector(".generate-form");
const imageGallary = document.querySelector(".image-gallary");

const OPENAI_API_KEY = "Enter Your API key";
let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallary.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadButton = imgCard.querySelector(".download-btn");

    //Set the image source to the AI generated image data
    const aiGeneratedImg = `data:image/jpge;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratedImg;

    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadButton.setAttribute("href", aiGeneratedImg);
      downloadButton.setAttribute("download", `${new Date().getTime()}.jpg`);
    };
  });
};

const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: userPrompt,
          n: parseInt(userImgQuantity),
          size: "512x512",
          response_format: "b64_json",
        }),
      }
    );

    if (!response.ok)
      throw new Error("Failed to generate images! Please try again.");

    const { data } = await response.json();
    updateImageCard([...data]);
  } catch (error) {
    console.log(error);
  } finally {
    isImageGenerating = false;
  }
};

const handleFormSubmission = (e) => {
  e.preventDefault();
  if(isImageGenerating) return;
  isImageGenerating = true;

  //get user input and image quantity values from the form
  const userPrompt = e.srcElement[0].value;
  const userImgQuantity = e.srcElement[1].value;

  //Creating HTML markup for image cards with loading state
  const imgCardMarkup = Array.from(
    { length: userImgQuantity },
    () =>
      `<div class="img-card loading">
        <img src="images/loader.svg" alt="">
        <a href="#" class="download-btn">
            <img src="images/download.svg" alt="download icon">
        </a>
    </div>`
  ).join("");

  imageGallary.innerHTML = imgCardMarkup;
  generateAiImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);
