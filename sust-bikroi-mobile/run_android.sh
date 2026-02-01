#!/bin/bash
export ANDROID_HOME=/home/stoic/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
npm run android
