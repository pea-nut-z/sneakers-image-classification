## An image classification browser app for Yeezy sneakers.

[Link to app](https://pea-nut-z.github.io/sneakers-image-classification/)

### Context

The purpose of this project is to demonstrate backend functionalities and not machine learning. Thus, it has a couple of flaws.  
The model was trained with 6 different sneakers and these are the only images on the filesystem. This means that if the selected image was one of the six then you would get an exact match, otherwise, it would return one of the six that has the highest percentage of accuracy.  
The prediction is done by analyzing colour characteristics. Having said that, predictions on a completely white image would return a pair of white sneakers with a high percentage of accuracy.  
The training model was done using a free tool. Paid training services would increase accuracy.

### To try it out:

1. Click "choose an image" to upload a Yeezy sneaker image from your local storage OR Google search "Yeezy sneakers" for an image to copy and paste the image address to the search bar (you can find the image address by right clicking an image and clicking 'Copy image address')
2. Click enter to upload the picture if you used an image address
3. Click predict to start predicting!

### To get an exact match

Due to limitations, only six sneakers listed below will return an exact match. You may use the following keywords to search on Google image and copy the image address and paste on the search bar of the app or save the image to your local storage to upload:

-Yeezy blue tint  
-Yeezy platinum  
-Yeezy arzaerth  
-Yeezy beluga  
-Yeezy triple-white

### Potential future features

1. External image storage for a larger number of images
2. Return more than one result - for example, top 10 matches for more options
3. Filter functionalities - sort results by release date, available size, price, etc
4. Redirect - returned images are clickable and can redirect you to a page with more options (reviews, share, add to cart)
5. Auto train - this model was done by uploading images and tagging them manually. I could not find a free auto training service - more research required

### Road blocks

Initially when a prediction is made, it returns a tag which will match the name of one of the six image folders in the filesystem directory. It then goes through the matched folder and appends all images within the folder (see predict.js line 113). However, Github does not have static directories set up out of the box. I changed my code to accommodate that. I hard coded all the image paths in target_classes.js and looped through it to append.

I am using Jquery and Jest testing. It has been difficult to find good resources on testing Jquery functions that do not return values but manipulate the DOM. Most examples I find test functions that return a value and you would test on the return value which is straight forward. In my case, I have functions that run on loaded and on changed. When I import these functions to test, either it does not seem to run and change the DOM or it does not get to finish running before the test blocks start running. I have tried using callbacks and asynchronous functions to resolve the conflicts with no success. For now, I have a few layout testings in place and will continue to search ways to test the functionalities. Perhaps, jest-puppeteer? I will continue to update my progress.

-Updates-
-Puppeteer turns out working very well in testing the async functions! All testings added.
-Puppeteer requires some setup to get a test coverage report. I am now working on that and that's what .nyc_output file is for.

### Image recognition tools used

[Azure Custom Vision](https://www.customvision.ai/) to train and build the model

[Tensorflow](https://www.tensorflow.org/) to collect and pre-process the data of selected image
