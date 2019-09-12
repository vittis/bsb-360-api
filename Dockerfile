FROM node:10-alpine

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json yarn.lock ./

RUN yarn

COPY . .
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
EXPOSE 3030
CMD ["yarn", "start"]