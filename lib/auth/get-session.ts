import "server-only";

import { cache } from "react";
import { mockSession } from "./auth";

export const getServerSession = cache(async (_params?: unknown) => mockSession);
