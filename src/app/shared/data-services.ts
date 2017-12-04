import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import 'rxjs/Rx';


@Injectable()
export class DataStorageService {
    constructor(private http: Http, private recipeService: RecipeService) {}

    storeRecipes() {
      return  this.http.put('https://my-recipeapp-13d9d.firebaseio.com/recipes.json', this.recipeService
      .getRecipes()
        );
    }

    getRecipes() {
    this.http.get('https://my-recipeapp-13d9d.firebaseio.com/recipes.json')
    .map(
        (response: Response) => {
        const recipes: Recipe[] = response.json();
        // tslint:disable-next-line:prefer-const
        for ( let recipe of recipes) {
            if (!recipe['ingredients']) {
                console.log(recipe);
                recipe['ingredients'] = [];
            }
        }
            return recipes;
        }
    )
        .subscribe(
            (recipes: Recipe[]) => {
                this.recipeService.setRecipes(recipes);
            }
        );
    }
}
