// AnoneX Reaction Module
// Handles upvotes and reactions with privacy-preserving double-vote prevention

program anonex_reaction.aleo {
    // Reaction types
    const LIKE: u8 = 1u8;
    const LOVE: u8 = 2u8;
    const FIRE: u8 = 3u8;
    const THINK: u8 = 4u8;

    // Private record proving a user has reacted
    record ReactionReceipt {
        owner: address,
        post_id: field,
        reaction_type: u8,
        timestamp: u64
    }

    // Public mapping: post_id => total reaction count
    mapping reaction_counts: field => u64;

    // Public mapping: post_id => like count
    mapping like_counts: field => u64;

    // Mapping to track unique reactions (hash of user+post => bool)
    mapping has_reacted: field => bool;

    // Generate unique reaction identifier
    inline get_reaction_key(user: address, post_id: field) -> field {
        let user_field: field = BHP256::hash_to_field(user);
        return BHP256::hash_to_field(user_field + post_id);
    }

    // Add a reaction to a post
    async transition add_reaction(
        post_id: field,
        reaction_type: u8,
        timestamp: u64
    ) -> (ReactionReceipt, Future) {
        // Validate reaction type
        assert(reaction_type >= 1u8);
        assert(reaction_type <= 4u8);

        // Generate reaction key for this user+post combination
        let reaction_key: field = get_reaction_key(self.caller, post_id);

        // Create receipt for the user
        let receipt: ReactionReceipt = ReactionReceipt {
            owner: self.caller,
            post_id: post_id,
            reaction_type: reaction_type,
            timestamp: timestamp
        };

        // Finalize on-chain
        let f: Future = finalize_add_reaction(reaction_key, post_id, reaction_type);

        return (receipt, f);
    }

    async function finalize_add_reaction(
        reaction_key: field,
        post_id: field,
        reaction_type: u8
    ) {
        // Check if user has already reacted to this post
        let already_reacted: bool = Mapping::get_or_use(has_reacted, reaction_key, false);
        assert(!already_reacted);

        // Mark as reacted
        Mapping::set(has_reacted, reaction_key, true);

        // Increment total reaction count
        let current_total: u64 = Mapping::get_or_use(reaction_counts, post_id, 0u64);
        Mapping::set(reaction_counts, post_id, current_total + 1u64);

        // If it's a like, increment like count
        if reaction_type == 1u8 {
            let current_likes: u64 = Mapping::get_or_use(like_counts, post_id, 0u64);
            Mapping::set(like_counts, post_id, current_likes + 1u64);
        }
    }

    // Remove a reaction (requires the receipt)
    async transition remove_reaction(
        receipt: ReactionReceipt
    ) -> Future {
        // Verify ownership of reaction
        assert_eq(receipt.owner, self.caller);

        // Generate reaction key
        let reaction_key: field = get_reaction_key(self.caller, receipt.post_id);

        // Finalize removal
        return finalize_remove_reaction(reaction_key, receipt.post_id, receipt.reaction_type);
    }

    async function finalize_remove_reaction(
        reaction_key: field,
        post_id: field,
        reaction_type: u8
    ) {
        // Verify user had reacted
        let had_reacted: bool = Mapping::get_or_use(has_reacted, reaction_key, false);
        assert(had_reacted);

        // Mark as not reacted
        Mapping::set(has_reacted, reaction_key, false);

        // Decrement total reaction count
        let current_total: u64 = Mapping::get_or_use(reaction_counts, post_id, 0u64);
        if current_total > 0u64 {
            Mapping::set(reaction_counts, post_id, current_total - 1u64);
        }

        // If it was a like, decrement like count
        if reaction_type == 1u8 {
            let current_likes: u64 = Mapping::get_or_use(like_counts, post_id, 0u64);
            if current_likes > 0u64 {
                Mapping::set(like_counts, post_id, current_likes - 1u64);
            }
        }
    }

    // Change reaction type (consume old receipt, create new one)
    async transition change_reaction(
        old_receipt: ReactionReceipt,
        new_reaction_type: u8,
        timestamp: u64
    ) -> (ReactionReceipt, Future) {
        // Verify ownership
        assert_eq(old_receipt.owner, self.caller);
        
        // Validate new reaction type
        assert(new_reaction_type >= 1u8);
        assert(new_reaction_type <= 4u8);
        
        // Create new receipt
        let new_receipt: ReactionReceipt = ReactionReceipt {
            owner: self.caller,
            post_id: old_receipt.post_id,
            reaction_type: new_reaction_type,
            timestamp: timestamp
        };

        // Finalize change
        let f: Future = finalize_change_reaction(
            old_receipt.post_id,
            old_receipt.reaction_type,
            new_reaction_type
        );

        return (new_receipt, f);
    }

    async function finalize_change_reaction(
        post_id: field,
        old_type: u8,
        new_type: u8
    ) {
        // Update like count if changing to/from like
        let current_likes: u64 = Mapping::get_or_use(like_counts, post_id, 0u64);
        
        // If old was a like, decrement
        if old_type == 1u8 {
            if current_likes > 0u64 {
                Mapping::set(like_counts, post_id, current_likes - 1u64);
            }
        }
        
        // If new is a like, increment
        if new_type == 1u8 {
            let updated_likes: u64 = Mapping::get_or_use(like_counts, post_id, 0u64);
            Mapping::set(like_counts, post_id, updated_likes + 1u64);
        }
    }
}
