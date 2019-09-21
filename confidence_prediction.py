# -*- coding: utf-8 -*-
"""
Created on Wed Sep 18 18:54:14 2019

@author: pgsuser
"""

#========================== import the important libraries ===============
import pandas as pd
import numpy as np
import librosa
from pyAudioAnalysis import audioBasicIO
from pyAudioAnalysis import audioFeatureExtraction

def extract_features(c_file):
    [Fs, x] = audioBasicIO.readAudioFile(c_file)
    F, f_names = audioFeatureExtraction.stFeatureExtraction(x.flatten(), Fs, 0.050*Fs, 0.025*Fs)
    return F

def preProcess( fileName ):
    [Fs, x] = audioBasicIO.readAudioFile(fileName)
    if( len( x.shape ) > 1 and  x.shape[1] == 2 ):
        x = np.mean( x, axis = 1, keepdims = True )
    else:
        x = x.reshape( x.shape[0], 1 )
    F, f_names = audioFeatureExtraction.stFeatureExtraction(x[ :, 0 ],Fs, 0.050*Fs,0.025*Fs)
    return (f_names, F)

def getChromagram( audioData ):
    temp_data =  audioData[ 21 ].reshape(1,audioData[ 21 ].shape[0])
    chronograph = temp_data
    for i in range( 22, 33 ):
        temp_data =  audioData[ i ].reshape(1,audioData[ i ].shape[0])
        chronograph = np.vstack( [ chronograph,  temp_data ] )
    return chronograph

def getNoteFrequency( chromagram ):
    numberOfWindows = chromagram.shape[1]
    freqVal = chromagram.argmax( axis = 0 )
    histogram, bin = np.histogram( freqVal, bins = 12 )
    normalized_hist = histogram.reshape( 1, 12 ).astype( float ) / numberOfWindows
    return normalized_hist

def get_mfccs(file_name):
    X, sample_rate = librosa.load(file_name, res_type='kaiser_fast')
    mfccs = np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=12).T,axis=0)
    return mfccs

fileList = []
def getDataset(all_files):
    X = pd.DataFrame(  )
    #f_names = preProcess(total[0])[0]
    columns=[ 'mfcc_1','mfcc_2','mfcc_3','mfcc_4','mfcc_5','mfcc_6','mfcc_7','mfcc_8',
             'mfcc_9','mfcc_10','mfcc_11','mfcc_12','chroma_1','chroma_2','chroma_3',
             'chroma_4','chroma_5','chroma_6','chroma_7','chroma_8','chroma_9',
             'chroma_10','chroma_11','chroma_12']
    #columns = f_names
    for file in all_files:
        fileList.append( file )
        feature_name, features = preProcess(file )
        chromagram = getChromagram( features )
        noteFrequency = getNoteFrequency( chromagram )
        mfccs = get_mfccs(file)
        fin = np.concatenate([noteFrequency[0],mfccs])
        x_new =  pd.Series(fin)
        X = pd.concat( [ X, x_new ], axis = 1 )
        
    data = X.T.copy()
    data.columns = columns
    data.index = [ i for i in range( 0, data.shape[ 0 ] ) ]
    return data

col = [ 'mfcc_1','mfcc_7','mfcc_5','mfcc_2','chroma_3',
             'chroma_5','chroma_6','chroma_9',
             'chroma_10','chroma_11','chroma_12']
def test_example(filename,model):
    aa = getDataset([filename])
    aa = aa[col]
    predictions = model.predict_proba(aa)
    return predictions
