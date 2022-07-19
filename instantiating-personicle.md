---
date: "2022-07-15"
title: "Instantiating Personicle Infrastructure on Your Own Device"
image: "images/rubyonrails-personicle.png"
author_info: 
  name: "Zara Ahmed"
  image: "images/author/zara-ahmed.jpeg"
draft: false
---

**Authors**: *Tirth Patel and Zara Ahmed*

[<img src=http://vocal-hotteok-6c6b1b.netlify.app/images/personicle-logo-transparent.png width="700" height="140" />](https://personicle.org/)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

## Introduction
Personicle is a Mobile App which in its current form collects and processes the location, place, mobile device-specific measures like Calendar, Ambient Light, phone usage, and measures like Heart Rate, Activity Level, and Sleep from wearable devices like Fitbit or smartwatches. The first release uses Android phones and Fitbit devices; soon iOS and other smart wearables will be used. Currently, data is collected at every 5-minute interval to create activities and events, that may be used by health systems.

Personalization requires precise personal models; however, every individual is unique.  The story of their life is comprised of events at various granularities in time and space. Personal chronicle, aka Personicle, captures this story through these events. Generally, for modeling a person, one requires five event streams: Daily Life Events, Personal Events, Personal Biological Events, Social Events related to the person, and Environmental Events around the person. 

> [Charles Boicey](https://www.linkedin.com/in/charlesboicey) and [Ramesh Jain](https://ngs.ics.uci.edu/) Quotes

## Purpose
Users can interact with and manage their Personicle accounts via a Personicle web application. This application is built using the Ruby on Rails platform. In this article, “Instantiating Personicle Infrastructure on Your Own Device”, we will discuss the steps required for hosting this application. It is a guide for 3rd party developers on how to access user data for their applications. It covers all the installation instructions they will need for running Personicle on their own system.  

## Goal
> A Personicle is a chronicle of all events for the person. These events will be used to build their ‘model’ for understanding the underlying causes for various health outcomes: such as what caused the food allergy, or what resulted in major emotional upset. Such a model combined with their current situation(s), may help in the prediction of future situations as well as ways to prevent those situations.
> For each person, there will be a core Personicle that is developed through data being inputted from various application. Different applications may add a greater variety of data sources, events, and algorithms to extract more relevant information that will then be added to their core Personicle allowing for a transparent automation of inputs.

## Dashboard Functionality

- Users can see summary of lifestyle events and data (timeline charts, mobility, and sleep trends)
- Users can securely share their data with their healthcare provider via the physician dashboard
- Physicians can include a questionnaire about different symptoms and experiences that the users might have which are captured as a subjective data stream

## Tech

Personicle uses a number of open source projects to work on the front end application:

- [Ruby on Rails](https://rubyonrails.org/) - provides default structures for a database, a web service, and web pages.
- [Postgresql](https://www.postgresql.org/) - relational database management system emphasizing extensibility and SQL compliance
- [jQuery](https://jquery.com/) - JavaScript library designed to simplify HTML DOM tree traversal and manipulation, as well as event handling, CSS animation.
- [GoogleCharts](https://developers.google.com/chart) - interactive charts for browsers and mobile devices. 
- [React.js](https://reactjs.org/) - front-end JavaScript library for building user interfaces based on UI components.
##### For more details about Personicle, which is also an open-source project, see the [Personicle Github](https://github.com/vin-clearsense/Personicle) page.



## Installing the Dependencies

Clone the Personicle repo from https://github.com/ClearsenseData/personicle-rails.git

### A. Linux

Execute the following commands one by one to install Ruby 2.6.1. 

Script to install the NodeSource Node.js 12.x repo onto a Debian or Ubuntu system. Run as root or insert `sudo -E` before `bash`: 

```
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash –
``` 

Script to install Yarn in Ubuntu.      

```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - 
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list 
sudo apt-get update
``` 

Installation and updating of software in our system for additional dependencies.  

```
sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev \
sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev software-properties-common libffi-dev dirmngr gnupg \
apt-transport-https ca-certificates  nodejs yarn
``` 

Install rbenv for ruby version management (Instruction for Linux). Use rbenv to pick a Ruby version for your application and guarantee that your development environment matches production. Put rbenv to work with Bundler for painless Ruby upgrades and bulletproof deployments. rbenv intercepts Ruby commands using shim executables injected into your PATH, determines which Ruby version has been specified by your application, and passes your commands along to the correct Ruby installation.  

 
Clone the rbenv/rbenv github repository.  

```
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
``` 

Adds ```~/.rbenv/bin``` to the PATH environment variable. This allows the user to run executables from this location without needing to type out the whole path. Next, add ```~/.rbenv/bin``` to your $PATH so that you can use the rbenv command line utility. Do this by altering your ```~/.bashrc file``` so that it affects future login sessions:  

```
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
``` 

Then, add the command eval "$(rbenv init -)" to your ~/.bashrc file so rbenv loads automatically: 

```
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
``` 

ruby-build is a command-line utility that makes it easy to install virtually any version of Ruby, from source. It is available as a plugin for rbenv that provides the rbenv install command, or as a standalone program. Clone the rbenv/ruby-build repository. (rbenv/ruby-build: Compile and install Ruby – GitHub) 

```
git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
``` 

Add ```/.rbenv/plugins/ruby-build/bin``` to your $PATH for access to the rbenv command-line utility. For bash: Ubuntu Desktop users should configure ~/.bashrc: (Seamlessly manage your app's Ruby environment with rbenv) 

```
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
``` 

rbenv-vars is a plugin for rbenv that lets you set global and project-specific environment variables before spawning Ruby processes. Clone the repository for rbenv/rbenv-vars.  

```
git clone https://github.com/rbenv/rbenv-vars.git ~/.rbenv/plugins/rbenv-vars
``` 

The exec command replaces the current process image - the executable or program - with a new one, named as the argument to exec. If $SHELL contains the name of an executable, as it usually does, exec will spin that exe up in place of the running shell. 

```
exec $SHELL
```

**Install Rbenv** 

```
rbenv install 2.7.1 

rbenv global2.7.1
``` 

Check ruby version using: ```ruby –v``` 

```
gem install bundler
``` 

Check bundler version using: ```bundle – v``` 

* If command otputs bundle not found, run: ```rbenv rehash``` and try again (```bundle –v```) 

Install Rails using: ```gem install rails –v 6.0.3``` 

In terminal, run: 

```
git  clone https://github.com/ClearsenseData/personicle-rails.git 
cd  personicle-rails   
bundle install  
npm install  
cd config 
touch application.yml
``` 

### B. Windows
 
It is advises to install WSL (Windows subsytem for linux ) as Ruby dependencies works best on linux. 

**Install WSL** 

Open powershell as administrator and run the below command 

```
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
``` 

**Install Ubuntu from Microsoft Store**:
(https://apps.microsoft.com/store/detail/ubuntu-on-windows/9NBLGGH4MSV6?hl=en-us&gl=US) 
 * Once installed, open Ubuntu from start menu.  
* You will be asked to setup user. Remember the password as it will be used to install packages with ‘sudo’ 

**Install Rbenv and Ruby** 

* Follow instructions for Linux installation. 

### C. Mac

Check if homebrew is installed:
```
Brew --version
``` 

* If you get command not found install using the command below 

If homebrew is not installed on your mac, install it using the following command: 

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
``` 

**Installing rbenv and ruby**  

```
Brew update && brew upgrade
``` 
To check for issues with homebrew: 
```
Brew doctor
``` 
Installation might take a while: 
```
Brew install rbenv
Rbenv init
``` 

You might see the following message on running the above command: 

```
Load rbenv automatically by appending the following to ~/.zshrc: 
eval "$(rbenv init -)"
``` 

If you see ```~/.zshrc``` at the end of second line, run: 

```
echo 'eval "$(rbenv init -)"' >> ~/.zshrc
``` 

If you see ~/.bash_profile  at the end of second line, run: 

```
echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
``` 

Install ruby using rbenv (2.7.1 is the ruby version) 

```
rbenv install 2.7.1
```  

Make this version global: 
```
rbenv global 2.7.1
``` 

Rbenv rehash 

reopen the terminal and check the correct version of ruby is installed using: 
```
ruby –v
``` 

Install rails: 
```
Gem install rails –v 6.0.3
``` 

Rbenv rehash 

Check if correct rails version is installed using: 
```
rails -v
``` 

 

## Setting Up Application Configurations 

### A. Personicle Services Required (Auth, Data Read, Schema Validation, etc.)
Personicle has different backend services that are used by the personicle frontend application. To run your own personicle, these services need to configured and run along with the front-end application.  

* **Personicle External Connections for connecting Fitbit, Google Fit and Oura**: https://github.com/ClearsenseData/external-connections-personicle 
* **Personicle Authentication Service**: https://github.com/ClearsenseData/personicle-authentication-service. 	 
* **Backend API Service for Reading Personicle Data**: https://github.com/ClearsenseData/backend-data-api-v2 
* **Personicle Write Services**: https://github.com/ClearsenseData/personicle-write-services 
* **Personicle Schema Validation Service**: https://github.com/ClearsenseData/personicle-schema-validation 
* **A consumer to receive and send data to event hub**: https://github.com/tirth-clearsense/custom-consumer 

### B. Okta
Personicle uses Okta for user identity and access management. It uses OAuth 2.0 authorization code flow. An Okta app integration needs to be created. Follow instructions https://developer.okta.com/docs/guides/implement-grant-type/authcode/main/ to create OIDC app integration.  

* Once an app integration is created, get the ```client_id``` and ```client_secret```. 
* Secrets need to be configured to run your Personicle. Rename the file ```config/application.yml.test``` (https://github.com/ClearsenseData/personicle-rails/blob/main/config/application.yml.test) to ```application.yml``` and include your secrets here. 
* Create a group for physicians in your Okta project. https://help.okta.com/asa/en-us/Content/Topics/Adv_Server_Access/docs/setup/create-a-group.htm 
*  the group id and add it to ```PHYSICIAN_GROUP_ID``` in the ```application.yml``` file. 
* Create an API token. https://developer.okta.com/docs/guides/create-an-api-token/main/ 
* Add the token to ```GET_USER_GROUP_TOKEN``` in ```application.yml```. 
* Create Google identity provider in Okta. https://developer.okta.com/docs/guides/add-an-external-idp/google/main/#create-an-identity-provider-in-okta 
* Add google client id it to ```GOOGLE_IDP``` in ```application.yml```. 

### C. Database options for production vs local dev.

## Running and Accessing the Application

### A. DB Initialization and Migration
Once all the secrets are configured and dependencies are installed, run:

```
Rails db:migrate
``` 

### B. Running the application in development and production mode 
For running in development and production: 

* ```‘Rails s’```    to start the application in development mode on ```http://localhost:3000```  

To run the application in production mode: 

* You need to setup a ```postgresql database``` and add its config to ```application.yml``` file. 
* Uncomment line 17-22 in ```database.yml``` file and comment lines 23-26. 

```
RAILS_ENV=production rails db:migrate 
RAILS_ENV=production rails s
```  

## License

[MIT](https://github.com/ClearsenseData/personicle-rails/blob/main/LICENSE.md)

## Resources

1. [ClearsenseData GitHub for Personicle - Ruby on Rails](https://github.com/ClearsenseData/personicle-rails.git)
2. [Seamlessly Manage Your App's Ruby Environment with Rbenv](https://github.com/rbenv/rbenv)
3. [How To Install Ruby on Rails with rbenv on Ubuntu 20.04 | DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-install-ruby-on-rails-with-rbenv-on-ubuntu-20-04)
4. [rbenv/ruby-build: Compile and Install Ruby – GitHub](https://github.com/rbenv/ruby-build)