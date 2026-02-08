# Rider


All my life I have wanted a motorcycle and here recently I was finally able to get one. However Georgia weather has not been kind to me since, so I haven't been able to ride it much. Ever since I got it every few hours I'm checking the weather to see how things are looking. This is where I came up with the idea for Fair Weather Rider. 

My ultimate goal is to turn it into an app or widget on my phone so it is easily used, but I don't have the knowledge or time to do that in a weekend so I decided to come up with a prototype website. My goal is that after the Hackathon is over to go back refine a few thing and keep pushing forward on making it an actual app. 

I went with react for this project because it is really the only framework I have experience in. 

Although this version is very much a work in progress, I do plan on making it worthwhile with more features, a database, and better styling. 

I would appreciate any and all advice, my email is zcoombs66@gmail.com. 

Zachary Coombs University of Georgia
Purpose: 
Use riders' preferences about the weather to calculate if they would want to ride today or not

Problems: 
Creating an accurate equation to mix the variable of rider preferences. For example my first iteration would average the scores out but that would lead to days that have perfect temperature but 100% chance of rain getting a high score. This is not accurate as most people wouldn't want to ride in the rain even though the temperature is good. Honestly a lot of guess and check and some chat gpt. I have a few professors I'd like to reach out to about a better way to formulate it, but it works well as is. 
Transferring data from API calls across multiple webpages, not having the time or knowledge to set up the database I had to work around it so data could flow easily. I used local storage and useEfffect to access the data and to make sure it was accessed before trying any calculations on it. 
Making the pages look good and feel easy to use. Css is not my style so this takes me a good bit of time with making changes and going back and forth till it look/feels good. 

Tech:
React
open meteo for weather data on given coordinates
openweathermap for translating zip code into coordinates

