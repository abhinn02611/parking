import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initialCharacters'
})
export class InitialCharactersPipe implements PipeTransform {
  transform(text: any): string {
    let initial = '';
    try {
      const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
      const initials = [...text.matchAll(rgx)] || [];
      initial = (
        (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
      ).toUpperCase();
    } catch (e) { }
    return initial;
  }
}