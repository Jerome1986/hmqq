import { request } from '@/utils/request.ts'
import type { ExpertJoinResult } from '@/types/global'
import type { ExpertForm } from '@/types/expertJoin.ts'

/**
 * 达人入驻申请
 * /expertJoin-add
 */

export const expertJoinApi = (object: ExpertForm) => {
  return request<ExpertJoinResult>({
    method: 'POST',
    url: '/expertJoin-add',
    data: object,
  })
}
