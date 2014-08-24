## Status

- Wizard is OK, you can join it at 'http://localhost:3000'
- Mail is not working, yet.

## TODO

- Deal with posfix setup
- Use docker registery to speed up initial build.

## How to use this ?

### Windows / OSX

We'll try to build and start a docker container using a lightweight VM.

#### What I need

- Vagrant (>= 1.5)
- VirtualBox (>= 4.3.10)

#### Then ?

- vagrant up
- Go get some coffee
- Then enjoy !

When you're done with this:

- vagrant halt, will stop the VM.

And if you want to restart datastringer, re-run vagrant up.

#### If I want to update ?

- vagrant destroy
- vagrant up
- Go get another coffee

Or you can use vagrant ssh, and manage your docker image.

### *NIX

Here, you can build and run directly the datastringer container.

#### Dependencies:

- Docker

### So ?

On datastringer dir:

- docker build -t datastringer docker_datastringer (downloads the Internet, twice.)
- docker run -d -p 3000:3000 datastringer

### Updating ?

- docker rmi datastringer
- docker build -t datastringer platform/docker_datastringer.





