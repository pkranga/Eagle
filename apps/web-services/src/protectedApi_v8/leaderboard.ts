/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Request, Response, Router } from 'express'
import { IHallOfFameItem, ILeaderboard } from '../models/leaderboard.model'
import { CONSTANTS } from '../utils/env'
import { ERROR } from '../utils/message'
import { extractUserIdFromRequest } from '../utils/requestExtract'

const apiEndpoints = {
  hallOfFame: `${CONSTANTS.SB_EXT_API_BASE_2}/v2/TopLearners`,
  leaderboard: `${CONSTANTS.SB_EXT_API_BASE_2}/v2/LeaderBoard`,
}

export const leaderBoardApi = Router()

// Get leaderboard
leaderBoardApi.get(
  '/:durationType/:durationValue/:year',
  async (req: Request, res: Response) => {
    try {
      const rootOrg = req.header('rootOrg')

      if (!rootOrg) {
        res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
        return
      }

      const { durationType, durationValue, year } = req.params
      const userId = extractUserIdFromRequest(req)

      const leaderboard: ILeaderboard = await axios
        .get<ILeaderboard>(`${apiEndpoints.leaderboard}`, {
          headers: { rootOrg }, params: {
            duration_type: durationType,
            duration_value: durationValue,
            user_id: userId,
            year,
          },
        })
        .then((response) => response.data)

      return res.send(leaderboard)
    } catch (err) {
      return res
        .status((err && err.response && err.response.status) || 500)
        .send(err)
    }
  }
)

// Get Hall of Fame
leaderBoardApi.get('/hallOfFame', async (req: Request, res: Response) => {
  try {
    const rootOrg = req.header('rootOrg')

    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }

    const userId = extractUserIdFromRequest(req)

    const hallOfFame: IHallOfFameItem[] = await axios
      .get<IHallOfFameItem[]>(`${apiEndpoints.hallOfFame}`, {
        headers: { rootOrg }, params: {
          duration_type: 'M',
          leaderboard_type: 'L',
          user_id: userId,
        },
      })
      .then((response) => response.data)

    return res.send(hallOfFame)
  } catch (err) {
    return res
      .status((err && err.response && err.response.status) || 500)
      .send(err)
  }
})
