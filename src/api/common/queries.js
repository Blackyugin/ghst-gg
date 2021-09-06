export const gotchiesQuery = (skip, orderDir) => {
    return `{
        aavegotchis(
          first: 1000,
          skip: ${skip},
          orderBy: id,
          orderDirection: ${orderDir},
          where: {status: 3, owner_not: "0x0000000000000000000000000000000000000000"}
        ) {
          id
          name
          withSetsNumericTraits
          numericTraits
          baseRarityScore
          modifiedRarityScore
          withSetsRarityScore
          kinship
          level
          experience
          equippedWearables
          collateral
          hauntId
          owner {
            id
          }
        }
    }`
};

export const userQuery = (id) => {
    return `{
        user(id: "${id}") {
          id
          gotchisOwned(first: 1000, where: {status: 3}) {
            id
            name
            numericTraits
            modifiedNumericTraits
            withSetsNumericTraits
            baseRarityScore
            modifiedRarityScore
            withSetsRarityScore
            kinship
            equippedWearables
            experience
            level
            toNextLevel
            collateral
            hauntId
            owner {
              id
            }
          }
        }
    }`
};