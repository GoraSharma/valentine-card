import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-valentine-card',
  imports: [CommonModule],
  templateUrl: './valentine-card.component.html',
  styleUrl: './valentine-card.component.sass'
})
export class ValentineCardComponent {
  response: 'yes' | 'no' | null = null;
  noClickCount = 0;
  noButtonOffset = 0;
  noButtonOffsetY = 0;
  showButtons = true;

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
