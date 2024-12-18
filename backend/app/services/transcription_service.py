import numpy as np
import librosa
from transformers import WhisperProcessor, WhisperForConditionalGeneration

class TranscriptionService:
  SAMPLING_RATE = 16000
  CHUNK_LENGTH = 30

  def __init__(self):
    self.processor = WhisperProcessor.from_pretrained("openai/whisper-tiny")
    self.model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-tiny")
    self.model.config.forced_decoder_ids = None

  def preprocess_audio(self, audio_file):
    waveform, _ = librosa.load(audio_file, sr=self.SAMPLING_RATE)

    if waveform.ndim > 1:
      waveform = librosa.to_mono(waveform)

    waveform = np.array(waveform, dtype=np.float32)

    return waveform

  def split_audio(self, audio_file, chunk_length):
    waveform = self.preprocess_audio(audio_file)
    num_samples = len(waveform)
    chunk_size = chunk_length * self.SAMPLING_RATE
    chunks = []

    for i in range(0, num_samples, chunk_size):
      chunks.append(waveform[i:i + chunk_size])

    return chunks

  def transcribe_chunk(self, chunk):
    input_features = self.processor(
      chunk,
      sampling_rate=self.SAMPLING_RATE,
      return_tensors="pt"
    ).input_features

    attention_mask = input_features.ne(self.processor.feature_extractor.padding_value).long()
    predicted_ids = self.model.generate(input_features, attention_mask=attention_mask)
    transcription = self.processor.batch_decode(predicted_ids, skip_special_tokens=True)

    return transcription

  def transcribe(self, audio_file):
    chunks = self.split_audio(audio_file, self.CHUNK_LENGTH)
    transcriptions = []

    for chunk in chunks:
      transcribed_chunk = self.transcribe_chunk(chunk)
      transcriptions.extend(transcribed_chunk)

    return transcriptions