FROM node

# Set working directory for all build stages.
WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install express
RUN npm install mongoose
RUN npm install cors --save
RUN npm install body-parser
RUN npm install nodemailer
RUN npm install bcrypt
RUN npm install html-pdf
RUN npm install --save-dev price-to-polish-words
RUN npm install open
RUN npm install axios

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 8080

# Run the application.
CMD ["node", "index.js"]
