import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RefrigeratorPopup from '../components/educational/RefrigeratorPopup'
import CabinetPopup from '../components/educational/CabinetPopup'
import TablePopup from '../components/educational/TablePopup'
import SinkPopup from '../components/educational/SinkPopup'
import StovePopup from '../components/educational/StovePopup'
import useGameStore from '../store/gameStore'
import type { Ingredient, StationName } from '../types'

interface Props {
  onBack: () => void
  onFinish: () => void
}

type PopupName = 'fridge' | 'cabinet' | 'table' | 'sink' | 'stove' | null

export default function EducationalKitchen({ onBack, onFinish }: Props) {
  const [activePopup, setActivePopup] = useState<PopupName>(null)
  const {
    selectedRecipe,
    selectIngredient,
    collectedIngredients,
    selectedIngredients,
    initializeIngredients,
    requiredIngredients,
    washedIngredients,
    washIngredient,
    currentFeedback,
    clearFeedback,
  } = useGameStore()

  useEffect(() => {
    if (selectedRecipe) {
      initializeIngredients(selectedRecipe)
    }
  }, [selectedRecipe, initializeIngredients])

  // Auto-clear feedback after 3s
  useEffect(() => {
    if (!currentFeedback) return
    const t = setTimeout(clearFeedback, 3000)
    return () => clearTimeout(t)
  }, [currentFeedback, clearFeedback])

  const requiredCount = selectedRecipe?.ingredients.length ?? 0
  const collectedCount = collectedIngredients.length
  const allCollected = collectedCount === requiredCount && requiredCount > 0
  const allWashed = allCollected && washedIngredients.length >= collectedCount

  const handleIngredientSelect = useCallback(
    (ingredient: Ingredient) => {
      selectIngredient(ingredient)
    },
    [selectIngredient],
  )

  const openPopup = (name: PopupName) => setActivePopup(name)
  const closePopup = () => setActivePopup(null)

  return (
    <div className="virtual-cooking-laboratory">
      {/* Back Button */}
      <button className="kitchen-back-btn" onClick={onBack}>← Back</button>

      {/* Ingredient Counter */}
      {selectedRecipe && (
        <div className="kitchen-counter-hud">
          <strong>{selectedRecipe.name}</strong>
          <span>Collected: {collectedCount}/{requiredCount}</span>
        </div>
      )}

      {/* Feedback Toast */}
      <AnimatePresence>
        {currentFeedback && (
          <motion.div
            className={`feedback-toast ${currentFeedback.type}`}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            {currentFeedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kitchen Stations */}
      <div className="kitchen-station refrigerator-area" onClick={() => openPopup('fridge')}>
        🧊 Refrigerator
      </div>
      <div className="kitchen-station cabinet-area" onClick={() => openPopup('cabinet')}>
        🗄️ Cabinet
      </div>
      <div className="kitchen-station table-area" onClick={() => openPopup('table')}>
        🪵 Table
      </div>
      <div className="kitchen-station sink-area" onClick={() => openPopup('sink')}>
        🚰 Sink
      </div>
      <div className="kitchen-station stove-area" onClick={() => openPopup('stove')}>
        🔥 Stove
      </div>

      {/* Directional hints */}
      {allCollected && !allWashed && (
        <motion.div className="kitchen-hint" onClick={() => openPopup('sink')} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          → Clean your ingredients at the Sink
        </motion.div>
      )}
      {allWashed && (
        <motion.div className="kitchen-hint cooking-hint" onClick={() => openPopup('stove')} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          → Start cooking on the Stove!
        </motion.div>
      )}

      {/* Popups */}
      <AnimatePresence>
        {activePopup === 'fridge' && (
          <RefrigeratorPopup
            selectedIngredients={selectedIngredients}
            collectedIngredients={collectedIngredients}
            onIngredientSelect={handleIngredientSelect}
            onClose={closePopup}
            selectedRecipe={selectedRecipe}
          />
        )}
        {activePopup === 'cabinet' && (
          <CabinetPopup
            selectedIngredients={selectedIngredients}
            collectedIngredients={collectedIngredients}
            onIngredientSelect={handleIngredientSelect}
            onClose={closePopup}
            selectedRecipe={selectedRecipe}
          />
        )}
        {activePopup === 'table' && (
          <TablePopup
            selectedIngredients={selectedIngredients}
            collectedIngredients={collectedIngredients}
            onIngredientSelect={handleIngredientSelect}
            onClose={closePopup}
            selectedRecipe={selectedRecipe}
          />
        )}
        {activePopup === 'sink' && (
          <SinkPopup
            onClose={closePopup}
            collectedIngredients={collectedIngredients}
            onIngredientWash={(ing) => washIngredient(ing.name)}
          />
        )}
        {activePopup === 'stove' && (
          <StovePopup
            selectedIngredients={collectedIngredients}
            onClose={closePopup}
            onFinishCooking={onFinish}
            selectedRecipe={selectedRecipe}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
