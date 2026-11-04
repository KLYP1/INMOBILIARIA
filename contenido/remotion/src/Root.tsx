import React from "react";
import {Composition} from "remotion";
import {Vsl} from "./Vsl";
import {Hook} from "./v2/Hook";
import {Reel, SPEECH, OUTRO} from "./reel/Reel";
import {Reel2, SPEECH2, OUTRO2} from "./reel2/Reel2";
import {Reel3, SPEECH3, OUTRO3} from "./reel3/Reel3";
import {Reel4, SPEECH4, OUTRO4} from "./reel4/Reel4";
import {Cover4} from "./reel4/Cover";
import {Cover5} from "./reel5/Cover5";
import {Promo, PROMO_LEN} from "./promo/Promo";
import {PostComps} from "./posts/Posts";
import {Reel6, SPEECH6, OUTRO6} from "./reel6/Reel6";
import {Reel5, SPEECH5, OUTRO5} from "./reel5/Reel5";
import {Main, TOTAL} from "./v2/Main";
import {Demo2, DEMO_LEN} from "./v2/Demo2";

// v1 (archived): 5.0 + 7.5 + 7.5 + 6.27 + 11.2 + 2.7 + 52.4 + 7.9 + 9.9 + 7.77 + 2.9 + 6.37 + 2.2 s
const DURATION = 150 + 225 + 225 + 188 + 336 + 81 + 1572 + 237 + 297 + 233 + 87 + 191 + 66;

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="VSL" component={Vsl} durationInFrames={DURATION} fps={30} width={1920} height={1080} />
		<Composition id="VSL2" component={Main} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
		<Composition id="Demo2" component={Demo2} durationInFrames={Math.round(DEMO_LEN * 30)} fps={30} width={1920} height={1080} />
		<Composition id="Reel" component={Reel} durationInFrames={Math.round((SPEECH + OUTRO) * 30)} fps={30} width={1080} height={1920} />
		<Composition id="Reel2" component={Reel2} durationInFrames={Math.round((SPEECH2 + OUTRO2) * 30)} fps={30} width={1080} height={1920} />
		<Composition id="Reel3" component={Reel3} durationInFrames={Math.round((SPEECH3 + OUTRO3) * 30)} fps={30} width={1080} height={1920} />
		<Composition id="Reel4" component={Reel4} durationInFrames={Math.round((SPEECH4 + OUTRO4) * 30)} fps={30} width={1080} height={1920} />
		<Composition id="Cover4" component={Cover4} durationInFrames={1} fps={30} width={1080} height={1920} />
		<Composition id="Cover5" component={Cover5} durationInFrames={1} fps={30} width={1080} height={1920} />
		<Composition id="Reel5" component={Reel5} durationInFrames={Math.round((SPEECH5 + OUTRO5) * 30)} fps={30} width={1080} height={1920} />
		<Composition id="Gancho" component={Hook} durationInFrames={Math.round(17.3 * 30)} fps={30} width={1920} height={1080} />
		<Composition id="Promo" component={Promo} durationInFrames={Math.round(PROMO_LEN * 30)} fps={30} width={1080} height={1920} defaultProps={{sfx: true}} />
			<PostComps />
			<Composition id="Reel6" component={Reel6} durationInFrames={Math.round((SPEECH6 + OUTRO6) * 30)} fps={30} width={1080} height={1920} />
		</>
);
