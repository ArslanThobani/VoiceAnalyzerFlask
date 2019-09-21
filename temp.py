# -*- coding: utf-8 -*-
"""
Created on Thu Sep 19 12:05:41 2019

@author: pgsuser
"""
import sys
sys.path.append('C:/Users/pgsuser/Desktop/voxers/FlaskService/lib/OpenVokaturi-3-3/api')

import Vokaturi
import scipy.io.wavfile
from pydub import AudioSegment
from pydub.utils import make_chunks
import numpy as np

def analyzeAudio(filename):
    print("Loading library...")
    Vokaturi.load("lib/OpenVokaturi-3-3/lib/open/win/OpenVokaturi-3-3-win64.dll")
    print("Analyzed by: %s" % Vokaturi.versionAndLicense())
    
    print("Reading sound file...")
    (sample_rate, samples) = scipy.io.wavfile.read(filename)
    print("   sample rate %.3f Hz" % sample_rate)
    
    print("Allocating Vokaturi sample array...")
    buffer_length = len(samples)
    print("   %d samples, %d channels" % (buffer_length, samples.ndim))
    c_buffer = Vokaturi.SampleArrayC(buffer_length)
    if samples.ndim == 1:
        c_buffer[:] = samples[:] / 32768.0  # mono
    else:
        c_buffer[:] = 0.5*(samples[:,0]+0.0+samples[:,1]) / 32768.0  # stereo
    
    print("Creating VokaturiVoice...")
    voice = Vokaturi.Voice(sample_rate, buffer_length)
    
    print("Filling VokaturiVoice with samples...")
    voice.fill(buffer_length, c_buffer)
    
    print("Extracting emotions from VokaturiVoice...")
    quality = Vokaturi.Quality()
    emotionProbabilities = Vokaturi.EmotionProbabilities()
    voice.extract(quality, emotionProbabilities)
    
    if quality.valid:
        print("Neutral: %.3f" % emotionProbabilities.neutrality)
        print("Happy: %.3f" % emotionProbabilities.happiness)
        print("Sad: %.3f" % emotionProbabilities.sadness)
        print("Angry: %.3f" % emotionProbabilities.anger)
        print("Fear: %.3f" % emotionProbabilities.fear)
    
    voice.destroy()
    
    return emotionProbabilities


myaudio = AudioSegment.from_file("1.wav" , "wav") 
chunk_length_ms = 10000 # pydub calculates in millisec
chunks = make_chunks(myaudio, chunk_length_ms) #Make chunks of 10 secs
samples = myaudio.get_array_of_samples()
print(myaudio.frame_rate, np.array(samples))
#Export all of the individual chunks as wav files
(sample_rate, samples) = scipy.io.wavfile.read("1.wav")


for i, chunk in enumerate(chunks):
    
    analyzeAudio(chunk)
