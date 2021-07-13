import { Query as health } from "resolvers/app/health"
import { Query as share } from "resolvers/app/share"
export default {
    ...health,
    ...share
}