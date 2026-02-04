import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-valentine-card',
  imports: [CommonModule],
  templateUrl: './valentine-card.component.html',
  styleUrl: './valentine-card.component.sass'
})
export class ValentineCardComponent implements OnInit, OnDestroy {
  @ViewChild('backgroundMusic') audioPlayer!: ElementRef<HTMLAudioElement>;
  
  response: 'yes' | 'no' | null = null;
  noClickCount = 0;
  noButtonOffset = 0;
  noButtonOffsetY = 0;
  showButtons = true;
  
  // Translations for the question - Order: Kannada → English → Hindi
  questionTranslations = [
    { text: "ನೀನು ನನ್ನ ವ್ಯಾಲೆಂಟೈನ್ ಆಗುತ್ತೀಯಾ ಕಟ್ಠೆ?", lang: "Kannada" },
    { text: "Will you be my valentine Katthe?", lang: "English" },
    { text: "क्या तुम मेरी वेलेंटाइन बनोगी Katthe?", lang: "Hindi" }
  ];
  
  currentQuestionIndex = 0;
  currentQuestion = this.questionTranslations[0].text;
  questionTimer: any;
  isQuestionFading = false;

  ngOnInit() {
    // Try to play music after component initializes
    setTimeout(() => {
      this.playBackgroundMusic();
    }, 500);
    
    // Also try to play on any user interaction (click anywhere)
    document.addEventListener('click', this.startMusicOnInteraction.bind(this), { once: true });
    
    // Start rotating questions every 5 seconds
    this.startQuestionRotation();
  }

  ngOnDestroy() {
    // Clean up timer when component is destroyed
    if (this.questionTimer) {
      clearInterval(this.questionTimer);
    }
  }

  startQuestionRotation() {
    // Start with Kannada (index 0), then rotate every 5 seconds
    this.questionTimer = setInterval(() => {
      this.rotateQuestion();
    }, 5000);
  }

  rotateQuestion() {
    // Fade out
    this.isQuestionFading = true;
    
    // After fade out, change text and fade in
    setTimeout(() => {
      this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.questionTranslations.length;
      this.currentQuestion = this.questionTranslations[this.currentQuestionIndex].text;
      this.isQuestionFading = false;
    }, 250); // Half of transition time
  }

  startMusicOnInteraction() {
    this.playBackgroundMusic();
  }

  playBackgroundMusic() {
    if (this.audioPlayer?.nativeElement) {
      const audio = this.audioPlayer.nativeElement;
      const startAtSeconds = 20;

      const startAndPlay = () => {
        try {
          audio.currentTime = startAtSeconds;
        } catch {
          // If seeking fails, just start from beginning
        }
        // Try to play (may fail due to browser autoplay restrictions)
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            console.log('Autoplay prevented. Music will play after user interaction.');
          });
        }
      };

      // If metadata is loaded we can seek immediately, otherwise wait
      if (audio.readyState >= 1) {
        startAndPlay();
      } else {
        audio.addEventListener('loadedmetadata', () => {
          startAndPlay();
        }, { once: true });
      }
    }
  }

  handleYes() {
    this.response = 'yes';
    this.showButtons = false;
  }

  handleNo() {
    this.noClickCount++;
    
    if (this.noClickCount < 5) {
      // Reset response to ask again
      this.response = null;
      // Reset button position
      this.noButtonOffset = 0;
      this.noButtonOffsetY = 0;
    }
    // After 5 attempts, No button will be disabled (handled in template)
  }

  moveNoButton() {
    // Make the "No" button move away when hovered (classic Valentine card feature)
    const maxOffset = 100;
    this.noButtonOffset = Math.random() * maxOffset * 2 - maxOffset;
    this.noButtonOffsetY = Math.random() * maxOffset * 2 - maxOffset;
  }

  getNoMessage(): string {
    const messages = [
      "Are you sure? 😊",
      "Please reconsider! 💕",
      "Think about it again! 💖",
      "One more chance? 💗",
      "Last try? 💝"
    ];
    return messages[this.noClickCount - 1] || "";
  }
}
