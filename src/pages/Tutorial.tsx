import type { SetScreenProps } from '../types'

const tutorialSteps = [
  { icon: '🔪', title: 'Explore Kitchen Tools', desc: 'Learn about different knives, pans, utensils, plates, and measuring tools. You must view all categories before cooking.' },
  { icon: '📋', title: 'Select a Recipe', desc: 'Choose a level and recipe. Read the recipe card to see ingredients, tools, and steps needed.' },
  { icon: '🧅', title: 'Gather Ingredients', desc: 'Open the refrigerator, cabinet, and table to find and select the correct ingredients for your recipe.' },
  { icon: '🚿', title: 'Wash Ingredients', desc: 'At the sink, turn on the water and click each ingredient to wash it before preparation.' },
  { icon: '🔪', title: 'Prepare & Slice', desc: 'Use the correct cutting technique (chopping, slicing, dicing, julienne) as indicated by the recipe.' },
  { icon: '📏', title: 'Measure Accurately', desc: 'Use measuring cups and spoons for precise amounts. Accuracy affects your score.' },
  { icon: '🔥', title: 'Cook on the Stove', desc: 'Select cookware, set the right heat level, and follow the cooking steps. Watch the temperature and timer!' },
  { icon: '⭐', title: 'Get Your Score', desc: 'Your performance is rated on accuracy, washing, cutting, cooking, and timing. Aim for 3 stars!' },
]

export default function Tutorial({ setScreen }: SetScreenProps) {
  return (
    <div className="panel tutorial-page" style={{ backgroundImage: "url('/assets/bg/main-bg.jpg')" }}>
      <div className="tools-overlay" />
      <button className="back-btn" onClick={() => setScreen('main-menu')}>← Back</button>

      <div className="tutorial-content">
        <h1>How to Play</h1>
        <div className="tutorial-steps">
          {tutorialSteps.map((step, i) => (
            <div key={i} className="tutorial-step">
              <div className="tutorial-step-number">{i + 1}</div>
              <div className="tutorial-step-icon">{step.icon}</div>
              <div className="tutorial-step-info">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
