import StationPopup from './StationPopup'
import { getIngredientsByStation } from '../../data/ingredients'
import type { Ingredient, Recipe } from '../../types'

interface Props {
  selectedIngredients: Ingredient[]
  collectedIngredients: Ingredient[]
  onIngredientSelect: (ingredient: Ingredient) => void
  onClose: () => void
  selectedRecipe: Recipe | null
}

export default function RefrigeratorPopup(props: Props) {
  return (
    <StationPopup
      title="🧊 Refrigerator"
      ingredients={getIngredientsByStation('fridge')}
      {...props}
    />
  )
}
