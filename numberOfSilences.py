# -*- coding: utf-8 -*-
"""
Created on Thu Sep 19 17:05:12 2019

@author: pgsuser
"""

from pyAudioAnalysis import audioBasicIO
from pyAudioAnalysis import audioFeatureExtraction
from pydub import AudioSegment
import numpy as np
from scipy.signal import hilbert, chirp

[Fs, audiodata] = audioBasicIO.readAudioFile("C:/Users/pgsuser/Desktop/voxers/FlaskService/1.wav")
data = audioBasicIO.stereo2mono(audiodata)

def getMaxContinuousZeros(dataArray):
   numberOfSilence = 0
   count = 0
   for d in dataArray:
       if d == 0:
           count = count+1
       else:
           if count > 2500 :
               numberOfSilence = numberOfSilence + 1
               count = 0
           else :
               count = 0
   return numberOfSilence


def getNumberOfSilence(data):
   segmentedEnvelope = []
   signal = hilbert(data)
   amplitude_envelope = np.abs(signal)
   #amplitude_envelope = smooth(data,window_len=30,window='hanning')
   for d in amplitude_envelope:
       if d <= 1000:
           segmentedEnvelope.append(0)
       else:
           segmentedEnvelope.append(3000)
#   plt.plot( signal, label='signal')
   #plt.plot( amplitude_envelope, label='envelope')
#   plt.plot( segmentedEnvelope, label='silence')
#   plt.show()
   return(getMaxContinuousZeros(segmentedEnvelope))


#numberOfStops = 0
#for i in range(0,len(data),100000):
#   val = getNumberOfSilence(data[i:i + 100000])
#   print(val)
#   numberOfStops = numberOfStops + int(val)
#print(numberOfStops)

def checkIfAcceptable(data):
    silences = getNumberOfSilence(data)
    if silences > 5:
        return False
    else:
        return True

count = 0    
for i in range(0, len(data), 100000):
    tempCount = 0
    if checkIfAcceptable(data[i:i + 100000]):
        count = count+1
        tempCount = tempCount +1
        
    print(tempCount)
    
print(count)
