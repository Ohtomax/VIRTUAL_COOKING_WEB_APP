
import type { CookingStepImageSet } from '../constant/interface'
/**
 * Pictures to show once cooking ends.
 *
 * `pan` is what sits on the burner the moment the dish finishes or ruins
 * itself; `served` is what reaches the bowl when the player presses Serve.
 * Recipes that ship no dedicated burnt art fall back to the final frame with
 * `charred: true`, and the caller tints it — a ruined dish must never read as
 * a good one.
 */
export function resolveOutcomeImages(recipeId: number, burned: boolean): {
  pan: string | null
  served: string | null
  charred: boolean
} {
  const set = COOKING_STEP_IMAGES[recipeId]
  const lastStep = set?.steps?.length ? set.steps[set.steps.length - 1] : null

  if (!burned) {
    return { pan: set?.done ?? lastStep ?? null, served: set?.servedGood ?? set?.done ?? null, charred: false }
  }
  const pan = set?.burntPan ?? null
  const served = set?.servedBurnt ?? pan
  if (pan || served) return { pan: pan ?? served, served: served ?? pan, charred: false }
  // Nothing burnt supplied — reuse the good frames and let CSS char them.
  const fallback = set?.done ?? lastStep ?? null
  return { pan: fallback, served: set?.servedGood ?? fallback, charred: true }
}

export const COOKING_STEP_IMAGES: Record<number, CookingStepImageSet> = {
  1: {
    steps: [
      '/assets/COOKING PART/1-bechamel/bechamel/1-melt-the-butter.png',
      '/assets/COOKING PART/1-bechamel/bechamel/2-add-the-roux.png',
      '/assets/COOKING PART/1-bechamel/bechamel/3-whisk-1-2-minutes.png',
      '/assets/COOKING PART/1-bechamel/bechamel/4-add-the-milk.png',
      '/assets/COOKING PART/1-bechamel/bechamel/5-whisking-constantly.png',
      '/assets/COOKING PART/1-bechamel/bechamel/6-thicken-into-creamy-sauce.png',
      '/assets/COOKING PART/1-bechamel/bechamel/7-add-salt.png',
      '/assets/COOKING PART/1-bechamel/bechamel/8-add-pepper.png',
      '/assets/COOKING PART/1-bechamel/bechamel/9-stir-the-sauce-gently.png'
    ],
    done: '/assets/COOKING PART/1-bechamel/bechamel/10-serve.png',
    burntPan: '/assets/COOKING PART/1-bechamel/bechamel/burn-version.png'
  },
  2: {
    steps: [
      '/assets/COOKING PART/2-espagnole/1-melt-butter.png',
      '/assets/COOKING PART/2-espagnole/2-add-carrots.png',
      '/assets/COOKING PART/2-espagnole/3-add-onion.png',
      '/assets/COOKING PART/2-espagnole/4-add-celery.png',
      '/assets/COOKING PART/2-espagnole/5-add-flour.png',
      '/assets/COOKING PART/2-espagnole/6-whisk.png',
      '/assets/COOKING PART/2-espagnole/7-add-tomato-paste.png',
      '/assets/COOKING PART/2-espagnole/8-add-beef-stock.png',
      '/assets/COOKING PART/2-espagnole/9-whisk.png',
      '/assets/COOKING PART/2-espagnole/10-simmer.png',
      '/assets/COOKING PART/2-espagnole/11-strain-the-sauce.png'
    ],
    // Finishing and ruining both happen in the pan; the bowl shots are
    // held back until Serve (Revised Feedback C4).
    done: '/assets/COOKING PART/2-espagnole/11-strain-the-sauce.png',
    burntPan: '/assets/COOKING PART/2-espagnole/12-burnt-while-cooking.png',
    servedGood: '/assets/COOKING PART/2-espagnole/serve-good.png',
    servedBurnt: '/assets/COOKING PART/2-espagnole/serve-burnt.png'
  },
  3: {
    steps: [
      '/assets/COOKING PART/3-tomato-sauce/1-heat-olive-oil.png',
      '/assets/COOKING PART/3-tomato-sauce/2-cook-the-onion.png',
      '/assets/COOKING PART/3-tomato-sauce/3-add-the-garlic.png',
      '/assets/COOKING PART/3-tomato-sauce/4-crushed-tomatoes.png',
      '/assets/COOKING PART/3-tomato-sauce/5-add-salt-and-pepper.png',
      '/assets/COOKING PART/3-tomato-sauce/6-whisk.png',
      '/assets/COOKING PART/3-tomato-sauce/7-cook-the-sauce.png'
    ],
    done: '/assets/COOKING PART/3-tomato-sauce/8-good.png',
    burntPan: '/assets/COOKING PART/3-tomato-sauce/8-cooking-burnt.png',
    servedGood: '/assets/COOKING PART/3-tomato-sauce/8-serve-good.png',
    servedBurnt: '/assets/COOKING PART/3-tomato-sauce/9-serve-burnt.png'
  },
  // Supplied sequence (DISH ADJUSTMENT): double boiler, egg yolks, whisk,
  // butter, season. The plated frame is new; the Drive's "final cook" and
  // burnt frames are not shared publicly, so `done` still holds on the
  // seasoned pan.
  4: {
    steps: [
      '/assets/COOKING PART/4-hollandaise/step-1.png',
      '/assets/COOKING PART/4-hollandaise/step-2.png',
      '/assets/COOKING PART/4-hollandaise/step-3.png',
      '/assets/COOKING PART/4-hollandaise/step-4.png',
      '/assets/COOKING PART/4-hollandaise/step-5.png'
    ],
    done: '/assets/COOKING PART/4-hollandaise/step-5.png',
    servedGood: '/assets/COOKING PART/4-hollandaise/7-serve.png'
  },
  5: {
    steps: [
      '/assets/COOKING PART/6-chicken-noodle-soup/1-add-cooking-oil.png',
      '/assets/COOKING PART/6-chicken-noodle-soup/2-add-onion.png',
      '/assets/COOKING PART/6-chicken-noodle-soup/3-add-celery.png',
      '/assets/COOKING PART/6-chicken-noodle-soup/4-add-garlic.png',
      '/assets/COOKING PART/6-chicken-noodle-soup/5-add-chicken-pieces.png',
      '/assets/COOKING PART/6-chicken-noodle-soup/6-pour-the-chicken-broth.png',
      '/assets/COOKING PART/6-chicken-noodle-soup/8-add-sliced-carrot.png',
      '/assets/COOKING PART/6-chicken-noodle-soup/9-stir-in-the-egg-noodles.png'
    ],
    done: '/assets/COOKING PART/6-chicken-noodle-soup/7-ladle.png',
    burntPan: '/assets/COOKING PART/6-chicken-noodle-soup/10-overcooked.png'
  },
  // Butternut Squash Soup — assets live in the 8-butternut-squash-soup folder.
  // This was an empty set, so the pot never changed and no serve image ever showed.
  // Re-cut to the supplied procedure (DISH ADJUSTMENT): sauté the aromatics
  // first, then the squash. The old `step-1-1` frame showed squash already in
  // the pot, which is why picking butter produced a pot of squash.
  6: {
    steps: [
      '/assets/COOKING PART/8-butternut-squash-soup/1-melt-butter.png',
      '/assets/COOKING PART/8-butternut-squash-soup/2-add-onion.png',
      '/assets/COOKING PART/8-butternut-squash-soup/3-add-garlic.png',
      '/assets/COOKING PART/8-butternut-squash-soup/4-add-squash.png',
      '/assets/COOKING PART/8-butternut-squash-soup/5-add-broth.png',
      '/assets/COOKING PART/8-butternut-squash-soup/6-mix-with-ladle.png'
    ],
    done: '/assets/COOKING PART/8-butternut-squash-soup/7-done.png',
    burntPan: '/assets/COOKING PART/8-butternut-squash-soup/8-burn-pan.png'
  },
  7: {
    steps: [
      '/assets/COOKING PART/5-tomato-soup/Step 1_ Prepare the ingredients_.png',
      '/assets/COOKING PART/5-tomato-soup/Step 2  Add cooking oil (2).png',
      '/assets/COOKING PART/5-tomato-soup/Step 3_ Sauté the vegetables_.png',
      '/assets/COOKING PART/5-tomato-soup/Step 4_ Cook the tomatoes_.png',
      '/assets/COOKING PART/5-tomato-soup/Step 5_ Add broth. And Simmer_.png',
      '/assets/COOKING PART/5-tomato-soup/Step 6_ Blend until smooth_.png'
    ],
    done: '/assets/COOKING PART/5-tomato-soup/Step 7 serve it_.png'
  },
  // Re-cut to the supplied procedure (DISH ADJUSTMENT): potatoes and corn both
  // go in before the broth.
  8: {
    steps: [
      '/assets/COOKING PART/7-corn-chowder-soup/1-melt-butter.png',
      '/assets/COOKING PART/7-corn-chowder-soup/2-add-onion.png',
      '/assets/COOKING PART/7-corn-chowder-soup/3-add-potato.png',
      '/assets/COOKING PART/7-corn-chowder-soup/4-add-corn.png',
      '/assets/COOKING PART/7-corn-chowder-soup/5-add-broth.png',
      '/assets/COOKING PART/7-corn-chowder-soup/6-simmer-until-tender.png',
      '/assets/COOKING PART/7-corn-chowder-soup/7-add-milk.png',
      '/assets/COOKING PART/7-corn-chowder-soup/8-add-salt-pepper.png'
    ],
    done: '/assets/COOKING PART/7-corn-chowder-soup/9-serve.png',
    burntPan: '/assets/COOKING PART/7-corn-chowder-soup/10-burn-pan.png',
    servedBurnt: '/assets/COOKING PART/7-corn-chowder-soup/11-serve-burnt.png'
  },
  // Supplied procedure (DISH ADJUSTMENT): marinating is prep work, so the pot
  // sequence opens with the oil and the already-marinated chicken. The first
  // four Drive frames (mixing bowl, chicken, soy sauce, garlic) belong to the
  // preparation area.
  9: {
    steps: [
      '/assets/COOKING PART/9-adobo/5-add-oil.png',
      '/assets/COOKING PART/9-adobo/6-put-the-marinated-chicken.png',
      '/assets/COOKING PART/9-adobo/7-put-the-marinated-soysauce.png',
      '/assets/COOKING PART/9-adobo/8-add-water.png',
      '/assets/COOKING PART/9-adobo/9-add-vinegar.png',
      '/assets/COOKING PART/9-adobo/10-add-bay-leaf.png',
      '/assets/COOKING PART/9-adobo/11-pepper.png',
      '/assets/COOKING PART/9-adobo/12-simmer.png'
    ],
    done: '/assets/COOKING PART/9-adobo/good.png',
    burntPan: '/assets/COOKING PART/9-adobo/13-burnt.png',
    servedBurnt: '/assets/COOKING PART/9-adobo/burnt.png'
  },
  10: {
    steps: [
      '/assets/COOKING PART/10-sinigang/1.png',
      '/assets/COOKING PART/10-sinigang/2.png',
      '/assets/COOKING PART/10-sinigang/3.png',
      '/assets/COOKING PART/10-sinigang/4.png',
      '/assets/COOKING PART/10-sinigang/5.png',
      '/assets/COOKING PART/10-sinigang/6.png',
      '/assets/COOKING PART/10-sinigang/porksinigang.png',
      '/assets/COOKING PART/10-sinigang/8-kangkong.png'
    ],
    done: '/assets/COOKING PART/10-sinigang/8.sinigangDone.png'
  },
  // Full sequence from the supplied procedure (DISH ADJUSTMENT): aromatics,
  // shrimp paste, then the vegetables in order. Only three frames were wired
  // before, so the pot stopped changing after the garlic.
  11: {
    steps: [
      '/assets/COOKING PART/11-pakbet/1-add-cooking-oil.png',
      '/assets/COOKING PART/11-pakbet/2-add-onion.png',
      '/assets/COOKING PART/11-pakbet/3-add-garlic.png',
      '/assets/COOKING PART/11-pakbet/4-add-tomato.png',
      '/assets/COOKING PART/11-pakbet/5-add-bagoong.png',
      '/assets/COOKING PART/11-pakbet/6-add-squash.png',
      '/assets/COOKING PART/11-pakbet/7-add-sitaw.png',
      '/assets/COOKING PART/11-pakbet/8-add-eggplant.png',
      '/assets/COOKING PART/11-pakbet/9-add-ampalaya.png'
    ],
    done: '/assets/COOKING PART/11-pakbet/10-cooked.png',
    burntPan: '/assets/COOKING PART/11-pakbet/11-burn-pan.png',
    servedGood: '/assets/COOKING PART/11-pakbet/13-serve-good.png',
    servedBurnt: '/assets/COOKING PART/11-pakbet/14-serve-burnt.png'
  },
  // Beef Caldereta — assets live in the "15. BEEF CALDERETA" folder.
  // Previously empty: the pot stayed as the bare cookware for the whole cook.
  12: {
    steps: [
      '/assets/COOKING PART/15. BEEF CALDERETA/1  Add cooking oil.png',
      '/assets/COOKING PART/15. BEEF CALDERETA/Step 2  Sauté the aromatics_.png',
      '/assets/COOKING PART/15. BEEF CALDERETA/Step 3_ Brown the beef_.png',
      '/assets/COOKING PART/15. BEEF CALDERETA/Step 4_ Add the sauce_.png',
      '/assets/COOKING PART/15. BEEF CALDERETA/Step 5_ Simmer the beef_.png',
      '/assets/COOKING PART/15. BEEF CALDERETA/Step 6_ Add the vegetables_.png',
      '/assets/COOKING PART/15. BEEF CALDERETA/Step 7_ Finish the dish_.png'
    ],
    done: '/assets/COOKING PART/15. BEEF CALDERETA/Step 8_ Serve_.png'
  },
  // Supplied procedure (DISH ADJUSTMENT): fry the fish, build and thicken the
  // sauce, then the vegetables, then return the fish to the pan.
  13: {
    steps: [
      '/assets/COOKING PART/13-fish-escabeche/1-put-the-oil.png',
      '/assets/COOKING PART/13-fish-escabeche/2-fry-the-fish.png',
      '/assets/COOKING PART/13-fish-escabeche/3-prepare-the-sauce.png',
      '/assets/COOKING PART/13-fish-escabeche/4-thicken-the-sauce.png',
      '/assets/COOKING PART/13-fish-escabeche/5-add-onion.png',
      '/assets/COOKING PART/13-fish-escabeche/6-add-carrot.png',
      '/assets/COOKING PART/13-fish-escabeche/7-add-bell-pepper.png',
      '/assets/COOKING PART/13-fish-escabeche/8-add-the-fish.png'
    ],
    done: '/assets/COOKING PART/13-fish-escabeche/9-serve.png',
    burntPan: '/assets/COOKING PART/13-fish-escabeche/10-burn-pan.png',
    servedBurnt: '/assets/COOKING PART/13-fish-escabeche/11-serve-burnt.png'
  },
  // Supplied order (DISH ADJUSTMENT): boil, onion + simmer, corn and potato,
  // cabbage, season. The Drive's in-pan burnt frame is not shared publicly.
  14: {
    steps: [
      '/assets/COOKING PART/14-bulalo/1-boil-the-beef.png',
      '/assets/COOKING PART/14-bulalo/2-add-onion-simmer.png',
      '/assets/COOKING PART/14-bulalo/3-add-corn-potato.png',
      '/assets/COOKING PART/14-bulalo/4-add-cabbage.png',
      '/assets/COOKING PART/14-bulalo/5-add-salt-pepper.png'
    ],
    done: '/assets/COOKING PART/14-bulalo/6-serve.png',
    servedBurnt: '/assets/COOKING PART/14-bulalo/8-serve-burnt.png'
  },
  15: {
    steps: [
      '/assets/COOKING PART/12-kare-kare/Step 1_ Prepare the ingredients_.png',
      '/assets/COOKING PART/12-kare-kare/Step 2_ Boil the beef_.png',
      '/assets/COOKING PART/12-kare-kare/Step 3_ Tenderize the meat_.png',
      '/assets/COOKING PART/12-kare-kare/Step 4_ Prepare the sauce base_.png',
      '/assets/COOKING PART/12-kare-kare/Step 5_ Add the vegetables_.png',
      '/assets/COOKING PART/12-kare-kare/Step 6_ Add the leafy vegetables_.png',
      '/assets/COOKING PART/12-kare-kare/Step 7_ Season and finish_.png'
    ],
    done: '/assets/COOKING PART/12-kare-kare/Step 8 serve it_.png',
    burntPan: '/assets/COOKING PART/12-kare-kare/burn pan version.png'
  },
  16: {
    steps: [
      '/assets/COOKING PART/16-pasta/2-boil-the-water.png',
      '/assets/COOKING PART/16-pasta/3-add-the-pasta.png',
      '/assets/COOKING PART/16-pasta/5-prepare-the-frying-pan.png',
      '/assets/COOKING PART/16-pasta/6-heat-the-oil.png',
      '/assets/COOKING PART/16-pasta/7-saute-the-garlic.png',
      '/assets/COOKING PART/16-pasta/8-add-the-onion.png',
      '/assets/COOKING PART/16-pasta/9-add-the-ground-meat.png',
      '/assets/COOKING PART/16-pasta/10-pour-the-spaghetti-sauce.png',
      '/assets/COOKING PART/16-pasta/11-seasons-with-salt-and-pepper.png'
    ],
    done: '/assets/COOKING PART/16-pasta/13-combine-the-sauce-to-the-pasta.png'
  },
  17: {
    steps: [
      '/assets/COOKING PART/19-pork-afritada/2. add oil.png',
      '/assets/COOKING PART/19-pork-afritada/3. add garlic_.png',
      '/assets/COOKING PART/19-pork-afritada/4. add onion_.png',
      '/assets/COOKING PART/19-pork-afritada/5. add pork.png',
      '/assets/COOKING PART/19-pork-afritada/6. cook the pork.png',
      '/assets/COOKING PART/19-pork-afritada/7. add tomato sauce_.png',
      '/assets/COOKING PART/19-pork-afritada/8. add water.png',
      '/assets/COOKING PART/19-pork-afritada/9.  haluin.png',
      '/assets/COOKING PART/19-pork-afritada/10 cover.png',
      '/assets/COOKING PART/19-pork-afritada/11 add potato and carrots ( dont appear until both ingredients are put).png',
      '/assets/COOKING PART/19-pork-afritada/12. add bell peppers_.png',
      '/assets/COOKING PART/19-pork-afritada/13. add salt.png',
      '/assets/COOKING PART/19-pork-afritada/14. add black pepper_.png'
    ],
    done: '/assets/COOKING PART/19-pork-afritada/15. Good Cooking_.png',
    burntPan: '/assets/COOKING PART/19-pork-afritada/16. Burnt cooking_.png'
  },
  // Supplied procedure (DISH ADJUSTMENT): pounding the beef, laying the
  // filling and rolling it are preparation-area work, so the pot sequence
  // opens with the oil and the finished roll.
  // Supplied order (DISH ADJUSTMENT). Steps 1–7 are preparation-area work in
  // the spec; they stay in the cooking sequence until the prep table gains a
  // mode for pounding and rolling, so the filling remains usable.
  18: {
    steps: [
      '/assets/COOKING PART/18-beef-morcon/beef-morcon/1-beef.png',
      '/assets/COOKING PART/18-beef-morcon/beef-morcon/2-prepare-the-beef.png',
      '/assets/COOKING PART/18-beef-morcon/beef-morcon/3-add-carrot-strips.png',
      '/assets/COOKING PART/18-beef-morcon/beef-morcon/4-add-hotdogs.png',
      '/assets/COOKING PART/18-beef-morcon/beef-morcon/5-add-pickle-relish.png',
      '/assets/COOKING PART/18-beef-morcon/beef-morcon/6-add-sliced-egg.png',
      '/assets/COOKING PART/18-beef-morcon/beef-morcon/7-roll-and-secure.png',
      '/assets/COOKING PART/18-beef-morcon/beef-morcon/8-heat-the-oil.png',
      '/assets/COOKING PART/18-beef-morcon/beef-morcon/9-put-the-beef-roll.png',
      '/assets/COOKING PART/18-beef-morcon/beef-morcon/10-brown-the-beef-roll.png',
      '/assets/COOKING PART/18-beef-morcon/beef-morcon/12-add-soy-sauce.png',
      '/assets/COOKING PART/18-beef-morcon/beef-morcon/13-add-beef-broth.png',
      '/assets/COOKING PART/18-beef-morcon/beef-morcon/11-simmer-the-beef-morcon.png',
      '/assets/COOKING PART/18-beef-morcon/beef-morcon/14-simmer-for-1½-2-hours.png',
      '/assets/COOKING PART/18-beef-morcon/beef-morcon/15-remove-the-twine.png'
    ],
    done: '/assets/COOKING PART/18-beef-morcon/beef-morcon/16-serve.png',
    burntPan: '/assets/COOKING PART/18-beef-morcon/beef-morcon/burn-version.png',
    servedBurnt: '/assets/COOKING PART/18-beef-morcon/beef-morcon/serve-burn-version.png'
  },
  // King Ranch Chicken — stove-top portion; the bake happens in MicrowaveView.
  // Previously empty, so neither the pot progression nor a serve/burnt image showed.
  19: {
    steps: [
      '/assets/COOKING PART/17-king-ranch-chicken/1-heat-the-oil.png',
      '/assets/COOKING PART/17-king-ranch-chicken/2-cook-the-onion&bell-pepper.png',
      '/assets/COOKING PART/17-king-ranch-chicken/3-make-the-sauce.png',
      '/assets/COOKING PART/17-king-ranch-chicken/4-place-the-tortilla.png',
      '/assets/COOKING PART/17-king-ranch-chicken/5-add-chicken-mixture.png',
      '/assets/COOKING PART/17-king-ranch-chicken/6-sprinkle-cheese-on-top.png',
      '/assets/COOKING PART/17-king-ranch-chicken/7-repeat-the-layers.png'
    ],
    done: '/assets/COOKING PART/17-king-ranch-chicken/serve.png',
    burntPan: '/assets/COOKING PART/17-king-ranch-chicken/serve-burn-version.png'
  },
}