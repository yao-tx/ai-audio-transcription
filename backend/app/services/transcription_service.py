from transformers import WhisperProcessor, WhisperForConditionalGeneration
import librosa
import numpy as np

class TranscriptionService:
  def __init__(self):
    self.processor = WhisperProcessor.from_pretrained("openai/whisper-tiny")
    self.model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-tiny")
    self.model.config.forced_decoder_ids = None

  def preprocess_audio(self, audio_file):
    waveform, _ = librosa.load(audio_file, sr=16000)
    if waveform.ndim > 1:
      waveform = librosa.to_mono(waveform)

    waveform = np.array(waveform, dtype=np.float32)

    return waveform

  def transcribe(self, audio_file):
    input_audio = self.preprocess_audio(audio_file)

    input_features = self.processor(
      input_audio,
      sampling_rate=16000,
      return_tensors="pt"
    ).input_features

    attention_mask = input_features.ne(self.processor.feature_extractor.padding_value).long()
    predicted_ids = self.model.generate(input_features, attention_mask=attention_mask)
    transcription = self.processor.batch_decode(predicted_ids, skip_special_tokens=True)

    return transcription
