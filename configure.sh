#!/usr/bin/env -S bash

echo "Compiling project"
ags bundle app.tsx todowidget

echo "Copying default project files to ~/.config/TodoWidget/"
mkdir ~/.config/TodoWidget/
cp ./defaultstyles/* ~/.config/TodoWidget/

echo "Would you like to install the program (Y/n)"
read install

if [ $install == "Y" ]; then
    echo "Installing todowidget to /usr/local/bin/"
    chmod +wrx ./todowidget
    sudo mv ./todowidget /usr/local/bin
fi