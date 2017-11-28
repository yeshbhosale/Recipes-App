import {  Component, OnInit, OnDestroy, ViewChild  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit , OnDestroy {
  @ViewChild('f') slFrom: NgForm;
  subscription: Subscription;
  editMode: false;
  editItemIndex: number;
  editedItem: Ingredient;


  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService.startedEditing
    .subscribe(
      (index: number) => {
        this.editItemIndex = index;
        this.editMode = true;
        this.editedItem = this.slService.getIngredient(index);
        this.slFrom.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        }); 
      }
    );
  }

  onSubmit(from: NgForm) {
    const value = from.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.slService.updateIngredient(this.editItemIndex, newIngredient);
    }else {
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    from.reset();
  }

  onClear() {
    this.slFrom.reset();
    this.editMode = false;
  }
  onDelete() {
    this.slService.deleteIngredient(this.editItemIndex);
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
