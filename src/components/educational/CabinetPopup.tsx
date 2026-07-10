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

export default function CabinetPopup(props: Props) {
  return (
    <StationPopup
      title="🗄️ Cabinet / Pantry"
      ingredients={getIngredientsByStation('cabinet')}
      {...props}
    />
  )
}
