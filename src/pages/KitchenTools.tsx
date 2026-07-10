import { useState } from 'react'
import { CheckCircle2, ArrowRight, Play } from 'lucide-react'
import { toolCategories } from '../data/tools'
import useGameStore from '../store/gameStore'
import type { SetScreenProps, ToolCategory } from '../types'

export default function KitchenTools({ setScreen }: SetScreenProps) {
  const [selectedTool, setSelectedTool] = useState<ToolCategory | null>(null)
  const { toolsViewed, markToolViewed, isAllToolsViewed } = useGameStore()

  const allViewed = isAllToolsViewed()
  const totalCategories = toolCategories.length

  const handleMarkViewed = (toolId: number) => {
    markToolViewed(toolId)
    setSelectedTool(null)
  }

  const handleProceed = () => {
    setScreen('level-select')
  }

  return (
    <div className="kitchen-tools-screen" style={{ backgroundImage: "url('/assets/bg/main-bg.jpg')" }}>
      <div className="tools-overlay" />

      <button className="back-btn" onClick={() => setScreen('main-menu')}>
        ← Back
      </button>

      <div className="tools-content">
        <div className="tools-header">
          <h1>Kitchen Tools & Equipment</h1>
          <p>Explore all tools before starting to cook</p>
          <div className="progress-indicator">
            <span>Viewed: {toolsViewed.length}/{totalCategories}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(toolsViewed.length / totalCategories) * 100}%` }} />
            </div>
          </div>
        </div>

        {!selectedTool ? (
          <>
            <div className="tools-grid">
              {toolCategories.map((cat) => (
                <div
                  key={cat.id}
                  className={`tool-card ${toolsViewed.includes(cat.id) ? 'viewed' : ''}`}
                  onClick={() => setSelectedTool(cat)}
                >
                  <div className="tool-icon">{cat.icon}</div>
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                  {toolsViewed.includes(cat.id) && (
                    <div className="viewed-badge">
                      <CheckCircle2 size={20} />
                      <span>Viewed</span>
                    </div>
                  )}
                  <div className="explore-btn">
                    <span>Explore</span>
                    <ArrowRight size={18} />
                  </div>
                </div>
              ))}
            </div>

            {/* Progression rule: can only proceed after viewing all tools */}
            {allViewed ? (
              <div className="proceed-section">
                <p className="proceed-message success">All tools explored! You can now proceed.</p>
                <button className="proceed-btn" onClick={handleProceed}>
                  <Play size={24} />
                  Proceed to Cooking Levels
                </button>
              </div>
            ) : (
              <div className="proceed-section">
                <p className="proceed-message locked">Explore all kitchen tools to continue</p>
                <button className="proceed-btn disabled" disabled>
                  <Play size={24} />
                  Proceed to Cooking Levels
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="tool-detail">
            <button className="back-to-tools-btn" onClick={() => setSelectedTool(null)}>
              ← Back to Tools
            </button>

            <div className="detail-header">
              <div className="detail-icon">{selectedTool.icon}</div>
              <h2>{selectedTool.name}</h2>
              <p>{selectedTool.description}</p>
            </div>

            <div className="tool-types">
              <h3>Types of {selectedTool.name}</h3>
              <div className="types-grid">
                {selectedTool.types.map((type, i) => (
                  <div key={i} className="type-card">
                    <div className="type-image">
                      <img src={type.image} alt={type.name} />
                    </div>
                    <h4>{type.name}</h4>
                    <div className="type-info">
                      <div className="info-item">
                        <strong>How to Use:</strong>
                        <p>{type.use}</p>
                      </div>
                      <div className="info-item">
                        <strong>Best For:</strong>
                        <p>{type.bestFor}</p>
                      </div>
                      {type.name && (
                        <div className="info-item">
                          <strong>Tip:</strong>
                          <p>Keep your {type.name.toLowerCase()} clean and dry after each use for best results.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="mark-viewed-btn" onClick={() => handleMarkViewed(selectedTool.id)}>
              <CheckCircle2 size={20} />
              Mark as Viewed & Return
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
