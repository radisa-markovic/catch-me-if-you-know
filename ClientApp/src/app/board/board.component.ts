import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AnswersService } from '../answers.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit {
    currentPlayerId: AllowedPlayerIds = 0;
    currentPositionForPlayer: number = 0;
    numberOfFieldsToAdvance: number = 0;

    farLeftIndexes: number[] = [7,10,12,14,16];

    @ViewChildren('boardField') boardFields!: QueryList<ElementRef>;

    constructor(private answersService: AnswersService) { }

    ngOnInit(): void {
        this.answersService.currentInfo.subscribe((currentInfo) => {
            this.currentPlayerId = <AllowedPlayerIds>currentInfo.currentPlayerId;
            this.currentPositionForPlayer = currentInfo.currentPlayerPosition;
            this.numberOfFieldsToAdvance = currentInfo.numberOfCorrectAnswers;
       
            if(this.numberOfFieldsToAdvance > 0)
            {
                let fieldIndexesArray = [this.currentPositionForPlayer];
                for(let i=1; i<this.numberOfFieldsToAdvance; i++)
                    fieldIndexesArray.push(this.currentPositionForPlayer + i);

                let someConsecutiveElements: ElementRef<HTMLLIElement>[] = this.boardFields.filter((field) => {
                    return fieldIndexesArray.includes(+field.nativeElement.getAttribute("data-field-id"))
                });

                someConsecutiveElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.nativeElement.classList.add("orange-color");
                    }, index * 500);
                });
            }
        });
    }

    isFarLeftIndex(i: number) : boolean
    {
        return [7, 10, 12, 14, 16].includes(i);
    }

    isFarRightIndex(i: number): boolean
    {
        return [9, 11, 13, 15, 17].includes(i);
    }

    isBottomIndex(i: number): boolean 
    {
        return i >= 18;
    }

    calculateIndex(index: number): number
    {
        if(index < 7) 
            return index;
        
        if(this.isFarLeftIndex(index))
            return 23 - this.farLeftIndexes.indexOf(index);

        if(this.isFarRightIndex(index)) 
            return (index - 9) / 2 + 7;

        // if(this.isBottomIndex(index))
        return 36 - index;
    }

}

type AllowedPlayerIds = -1 | 0 | 1 | 2 | 3;

/* @for (i of [].constructor(49).keys(); track i){
    <li class="game-field">
        @if(i<7){
            {{ i }}
        } @else if (i < 42 && i % 7 === 0) {
            {{ 24 - i / 7 }}
        } @else if( i < 42 && i % 7 === 6) {
            {{ 5 + ((i+1) / 7)}}
        } @else if(i >= 42) {
            {{ 60 - i }}
        } @else {
            {{ "-" }}
        }
    </li>
    } */